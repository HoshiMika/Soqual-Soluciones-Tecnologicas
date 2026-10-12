# Soqual Soluciones Tecnológicas

Sitio web de **Soqual ST**: soporte técnico en computadores, aplicaciones, desarrollo web y cámaras de seguridad.

## Características

- Diseño moderno con tema oscuro/claro (se recuerda la preferencia del usuario).
- 100 % responsive, menú móvil y botón flotante de WhatsApp.
- Animaciones al hacer scroll, contadores animados y cuenta regresiva real para promociones.
- Accesible: navegación por teclado, `skip link`, etiquetas ARIA y soporte para `prefers-reduced-motion`.
- SEO: meta descripciones, Open Graph, datos estructurados (`LocalBusiness`) y manifiesto web.
- Formulario de contacto con validación en cliente y servidor, anti-spam y guardado en PostgreSQL.
- Galería de trabajos con filtros por categoría y visor de fotos y videos.
- Asistente virtual con IA (Google Gemini) en la página de contacto. La clave vive solo en el servidor.
- Bot de soporte por WhatsApp en `WhatsAppBot/` (se instala aparte, en Cloudflare).
- Servidor Express con cabeceras de seguridad (CSP, HSTS en producción) y límite de envíos por IP.

## Estructura

```
CSS/main.css          Sistema de diseño compartido
HTML/                 Páginas (SoqualST = inicio, Servicios, Nosotros, Galeria, Contacto, 404)
Imagenes/             Logos, fotos del equipo e imágenes de servicios
Imagenes/Galeria/     Fotos y videos de trabajos para la galería
JS/theme.js           Aplica el tema antes de pintar la página
JS/main.js            Interacciones compartidas (menú, tema, animaciones, modal, cuenta regresiva)
JS/contacto.js        Envío del formulario de contacto
JS/galeria.js         Galería: lista de trabajos, filtros y visor
JS/chatbot.js         Ventana del asistente virtual
server/server.js      Servidor web + API (/api/enviar, /api/chat, /api/health)
server/db.js          Conexión a PostgreSQL
server/init-db.js     Crea la tabla mensajes_contacto
server/check-db.js    Prueba la conexión a la base de datos
WhatsAppBot/          Bot de WhatsApp (Cloudflare Worker), con su propio README
```

## Puesta en marcha

Requisitos: Node.js 20+ y PostgreSQL.

```bash
npm install
cp .env.example .env      # completa tus credenciales
npm run db:check          # verifica la conexión
npm run db:init           # crea la tabla (solo la primera vez)
npm start                 # http://localhost:3000
```

Para desarrollo con recarga automática: `npm run dev`.

También puedes abrir las páginas con **Live Server** (puerto 5501); el formulario enviará los datos al servidor Node en `localhost:3000`, que debe estar en ejecución.

## Personalizar

- **Fecha de fin de la promoción:** atributo `data-countdown-end` en `HTML/SoqualST.html`.
- **Colores y tipografías:** variables al inicio de `CSS/main.css`.
- **Galería:** agrega fotos o videos en `Imagenes/Galeria/` y regístralos en el arreglo `GALERIA` de `JS/galeria.js` (las instrucciones están al inicio del archivo).
- **Asistente virtual:** crea una clave en [Google AI Studio](https://aistudio.google.com/app/apikey) y ponla en `GEMINI_API_KEY` del archivo `.env`. Nunca la escribas en los archivos de `JS/`, porque esos los descarga cualquier visitante. Sus instrucciones (qué responde y qué no) están en `CHAT_INSTRUCCIONES`, en `server/server.js`.
