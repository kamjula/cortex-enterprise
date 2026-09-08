const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');

function secret(name) {
  const value = process.env[name];
  if (!value || value.length < 32) throw new Error(`${name} must be configured with at least 32 characters`);
  return value;
}
function issueAccessToken(user) {
  return jwt.sign({ sub: String(user.id), email: user.email, role: user.role || 'Viewer', type: 'access' }, secret('JWT_SECRET'), { algorithm: 'HS256', expiresIn: process.env.JWT_ACCESS_TTL || '15m' });
}
function issueRefreshToken(user) {
  return jwt.sign({ sub: String(user.id), type: 'refresh', jti: crypto.randomUUID() }, secret('JWT_REFRESH_SECRET'), { algorithm: 'HS256', expiresIn: process.env.JWT_REFRESH_TTL || '7d' });
}
function verifyToken(token, name, type) {
  const payload = jwt.verify(token, secret(name), { algorithms: ['HS256'] });
  if (payload.type !== type || !payload.sub) throw new Error('Invalid token type');
  return payload;
}
const verifyAccessToken = token => verifyToken(token, 'JWT_SECRET', 'access');
const verifyRefreshToken = token => verifyToken(token, 'JWT_REFRESH_SECRET', 'refresh');
function requireAuth(req, res, next) {
  const match = /^Bearer ([^\s]+)$/.exec(req.headers.authorization || '');
  if (!match) return res.status(401).json({ error: 'Authentication required' });
  try { req.user = verifyAccessToken(match[1]); return next(); }
  catch { return res.status(401).json({ error: 'Invalid or expired token' }); }
}
module.exports = { issueAccessToken, issueRefreshToken, verifyAccessToken, verifyRefreshToken, requireAuth };
