const pool = require('../config/db');

async function logAudit(req, action, entity, entityId, details) {
  try {
    const userId = req?.session?.user?.id || null;
    const ip = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
    await pool.query(
      `INSERT INTO audit_log (user_id, action, entity, entity_id, details, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, action, entity, entityId, details, String(ip).substring(0, 45)]
    );
  } catch (err) {
    console.error('Gagal mencatat audit log:', err.message);
  }
}

module.exports = {
  logAudit
};
