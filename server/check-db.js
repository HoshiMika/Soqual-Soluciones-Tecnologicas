// server/check-db.js - Verifica la conexión a PostgreSQL
const pool = require('./db');

(async () => {
  try {
    const { rows } = await pool.query('SELECT NOW() AS ahora');
    console.log('✅ Conexión exitosa a PostgreSQL. Hora del servidor:', rows[0].ahora);
  } catch (err) {
    console.error('❌ No se pudo conectar a PostgreSQL:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
