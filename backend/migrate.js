require("dotenv").config();
const fs = require("node:fs/promises");
const path = require("node:path");
const pool = require("./db");
const { setupAuthTables } = require("./authSchema");

async function migrate() {
  try {
    await setupAuthTables();
    const migrationPath = path.join(__dirname, "migrations", "001_user_settings.sql");
    const sql = await fs.readFile(migrationPath, "utf8");
    await pool.query(sql);
    console.log("Authentication and Settings tables ready.");
  } finally {
    await pool.end();
  }
}

migrate().catch(error => {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
});
