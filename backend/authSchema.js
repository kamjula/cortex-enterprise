const pool = require('./db');

async function setupAuthTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Viewer',
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS auth_refresh_tokens (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS auth_refresh_tokens_user_idx
      ON auth_refresh_tokens(user_id);
  `);
}

if (require.main === module) {
  require('dotenv').config();
  setupAuthTables().then(() => console.log('Auth tables ready.')).catch(error => {
    console.error('Auth schema setup failed:', error.message);
    process.exitCode = 1;
  }).finally(() => pool.end());
}

module.exports = { setupAuthTables };
