const { requireAuth } = require('./auth');

function requireActiveUser(pool) {
  return (req, res, next) => requireAuth(req, res, async () => {
    try {
      const result = await pool.query(
        'SELECT id, email, role FROM users WHERE id = $1 AND is_active = TRUE',
        [req.user.sub]
      );
      if (!result.rows[0]) return res.status(401).json({ error: 'Authentication required' });
      req.user = result.rows[0];
      return next();
    } catch (error) {
      console.error('Authentication check failed:', error.message);
      return res.status(503).json({ error: 'Authentication unavailable' });
    }
  });
}

module.exports = { requireActiveUser };
