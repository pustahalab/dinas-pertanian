const crypto = require('crypto');

/**
 * Hash password using Node.js crypto scrypt (secure salt + scrypt)
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify plain password against stored salt:hash
 */
function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) {
    // Fallback for plain text default seed if any
    return password === storedHash;
  }
  const [salt, key] = storedHash.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

/**
 * Generate secure random token
 */
function generateToken(bytes = 24) {
  return crypto.randomBytes(bytes).toString('hex');
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken
};
