// server/init-db.js - Crea la tabla de mensajes de contacto (idempotente)
const pool = require('./db');

const SQL = `
  CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    telefono VARCHAR(50),
    asunto VARCHAR(150),
    mensaje TEXT,
    fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
`;

(async () => {
  try {
    await pool.query(SQL);
    console.log('✅ Tabla lista: mensajes_contacto');
  } catch (err) {
    console.error('❌ Error creando la tabla:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
