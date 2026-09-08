const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const { issueAccessToken, issueRefreshToken, verifyRefreshToken, requireAuth } = require('./auth');
const hashToken = token => crypto.createHash('sha256').update(token).digest('hex');
const invalid = res => res.status(401).json({ error: 'Invalid credentials or session' });
const unavailable = res => res.status(500).json({ error: 'Authentication unavailable' });
function createAuthRouter(pool) {
  const router = express.Router();
  router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) return res.status(400).json({ error: 'Email and password are required' });
    try {
      const result = await pool.query('SELECT id, email, password_hash, role, is_active FROM users WHERE email = $1', [email.trim().toLowerCase()]);
      const user = result.rows[0];
      if (!user || !user.is_active || !(await bcrypt.compare(password, user.password_hash))) return invalid(res);
      const accessToken = issueAccessToken(user);
      const refreshToken = issueRefreshToken(user);
      const { exp } = verifyRefreshToken(refreshToken);
      await pool.query('INSERT INTO auth_refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)', [user.id, hashToken(refreshToken), new Date(exp * 1000)]);
      return res.json({ accessToken, refreshToken, tokenType: 'Bearer', user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) { console.error('Login failed:', error.message); return unavailable(res); }
  });
  router.post('/refresh', async (req, res) => {
    const token = req.body?.refreshToken;
    if (typeof token !== 'string' || !token) return invalid(res);
    let payload;
    try { payload = verifyRefreshToken(token); } catch { return invalid(res); }
    let client;
    try { client = await pool.connect(); } catch { return unavailable(res); }
    try {
      await client.query('BEGIN');
      const result = await client.query('SELECT t.id, u.id AS user_id, u.email, u.role, u.is_active FROM auth_refresh_tokens t JOIN users u ON u.id = t.user_id WHERE t.token_hash = $1 AND t.user_id = $2 AND t.revoked_at IS NULL AND t.expires_at > NOW() FOR UPDATE OF t', [hashToken(token), payload.sub]);
      const user = result.rows[0];
      if (!user || !user.is_active) { await client.query('ROLLBACK'); return invalid(res); }
      const nextAccess = issueAccessToken({ id: user.user_id, email: user.email, role: user.role });
      const nextRefresh = issueRefreshToken({ id: user.user_id });
      const { exp } = verifyRefreshToken(nextRefresh);
      await client.query('UPDATE auth_refresh_tokens SET revoked_at = NOW() WHERE id = $1', [user.id]);
      await client.query('INSERT INTO auth_refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)', [user.user_id, hashToken(nextRefresh), new Date(exp * 1000)]);
      await client.query('COMMIT');
      return res.json({ accessToken: nextAccess, refreshToken: nextRefresh, tokenType: 'Bearer' });
    } catch (error) { await client.query('ROLLBACK').catch(() => {}); console.error('Token refresh failed:', error.message); return unavailable(res); }
    finally { client.release(); }
  });
  router.post('/logout', async (req, res) => {
    const token = req.body?.refreshToken;
    if (typeof token !== 'string' || !token) return res.status(400).json({ error: 'Refresh token required' });
    let payload;
    try { payload = verifyRefreshToken(token); }
    catch (error) {
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') return res.status(204).end();
      console.error('Logout verification failed:', error.message);
      return unavailable(res);
    }
    try {
      await pool.query('UPDATE auth_refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1 AND user_id = $2 AND revoked_at IS NULL', [hashToken(token), payload.sub]);
      return res.status(204).end();
    } catch (error) { console.error('Logout failed:', error.message); return unavailable(res); }
  });
  router.get('/me', requireAuth, async (req, res) => {
    try {
      const result = await pool.query('SELECT id, email, role FROM users WHERE id = $1 AND is_active = TRUE', [req.user.sub]);
      if (!result.rows[0]) return invalid(res);
      return res.json({ user: result.rows[0] });
    } catch { return unavailable(res); }
  });
  return router;
}
module.exports = { createAuthRouter };
