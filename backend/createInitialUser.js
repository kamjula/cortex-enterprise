require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./db');
const { setupAuthTables } = require('./authSchema');

async function main() {
  const email = process.env.INITIAL_USER_EMAIL?.trim().toLowerCase();
  const password = process.env.INITIAL_USER_PASSWORD;
  if (!email || !password || password.length < 12) throw new Error('Set INITIAL_USER_EMAIL and INITIAL_USER_PASSWORD (at least 12 characters) in the environment.');
  await setupAuthTables();
  const hash = await bcrypt.hash(password, 12);
  const result = await pool.query("INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'Admin') ON CONFLICT (email) DO NOTHING RETURNING id", [email, hash]);
  if (!result.rowCount) throw new Error('User already exists; existing credentials were not changed.');
  console.log('Initial user created. Remove INITIAL_USER_PASSWORD from the environment.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => pool.end());
