// server/server.js - Servidor web + API del formulario de contacto
const path = require('path');
const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const pool = require('./db');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Orígenes permitidos para CORS (Live Server de VS Code por defecto en desarrollo)
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5501,http://127.0.0.1:5501')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Archivos JS que el navegador puede descargar. El código del servidor nunca se expone.
const PUBLIC_SCRIPTS = new Set(['theme.js', 'main.js', 'contacto.js']);

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// --- Cabeceras de seguridad -------------------------------------------------
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
      "font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com",
      "img-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );
  if (IS_PROD) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(express.json({ limit: '20kb' }));

// --- Archivos estáticos -----------------------------------------------------
const staticOpts = { maxAge: IS_PROD ? '7d' : 0, index: false };
app.use('/CSS', express.static(path.join(ROOT, 'CSS'), staticOpts));
app.use('/Imagenes', express.static(path.join(ROOT, 'Imagenes'), staticOpts));
app.use('/HTML', express.static(path.join(ROOT, 'HTML'), { ...staticOpts, maxAge: 0 }));

app.get('/JS/:file', (req, res, next) => {
  if (!PUBLIC_SCRIPTS.has(req.params.file)) return next();
  res.sendFile(path.join(ROOT, 'JS', req.params.file), { maxAge: staticOpts.maxAge });
});

app.get('/site.webmanifest', (req, res) => {
  res.type('application/manifest+json').sendFile(path.join(ROOT, 'site.webmanifest'));
});

// Las páginas usan enlaces relativos entre sí, por eso la raíz redirige a /HTML/
app.get('/', (req, res) => res.redirect(302, '/HTML/SoqualST.html'));

// --- API --------------------------------------------------------------------
const api = express.Router();
api.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || ALLOWED_ORIGINS.includes(origin)),
    methods: ['GET', 'POST'],
  })
);

// Límite simple en memoria: 5 envíos cada 10 minutos por IP
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const entry = hits.get(req.ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(req.ip, { start: now, count: 1 });
    return next();
  }
  if (++entry.count > MAX_HITS) {
    return res.status(429).json({ success: false, error: 'Demasiados envíos. Intenta de nuevo en unos minutos.' });
  }
  next();
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of hits) if (now - entry.start > WINDOW_MS) hits.delete(ip);
}, WINDOW_MS).unref();

api.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, db: 'up' });
  } catch {
    res.status(503).json({ ok: false, db: 'down' });
  }
});

api.post(
  '/enviar',
  rateLimit,
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 100 }).withMessage('El nombre es demasiado largo'),
    body('correo').trim().isEmail().withMessage('Correo electrónico inválido').isLength({ max: 150 }).normalizeEmail(),
    body('telefono').optional({ values: 'falsy' }).trim().isLength({ max: 50 }).matches(/^[0-9+()\s-]*$/).withMessage('Teléfono inválido'),
    body('asunto').optional({ values: 'falsy' }).trim().isLength({ max: 150 }).withMessage('El asunto es demasiado largo'),
    body('mensaje').trim().notEmpty().withMessage('El mensaje es obligatorio').isLength({ max: 5000 }).withMessage('El mensaje es demasiado largo'),
  ],
  async (req, res) => {
    // Campo trampa anti-spam: los humanos no lo ven, los bots lo rellenan
    if (req.body.website) return res.status(201).json({ success: true });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { nombre, correo, telefono, asunto, mensaje } = req.body;
    try {
      const { rows } = await pool.query(
        `INSERT INTO mensajes_contacto (nombre, correo, telefono, asunto, mensaje)
         VALUES ($1, $2, $3, $4, $5) RETURNING id, fecha_envio`,
        [nombre, correo, telefono || null, asunto || null, mensaje]
      );
      res.status(201).json({ success: true, row: rows[0] });
    } catch (err) {
      console.error('[api] Error al guardar el mensaje:', err.message);
      res.status(500).json({ success: false, error: 'No pudimos guardar tu mensaje. Intenta más tarde.' });
    }
  }
);

api.use((req, res) => res.status(404).json({ success: false, error: 'Ruta no encontrada' }));
app.use('/api', api);

// --- 404 y errores ----------------------------------------------------------
app.use((req, res) => res.status(404).sendFile(path.join(ROOT, 'HTML', '404.html')));

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, error: 'JSON inválido' });
  }
  console.error('[server] Error no controlado:', err);
  res.status(500).json({ success: false, error: 'Error interno del servidor' });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Soqual ST corriendo en http://localhost:${PORT}`);
});

// Cierre ordenado (Ctrl+C o señal del hosting)
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => pool.end().finally(() => process.exit(0)));
  });
}
