require("dotenv").config();
const pool = require("./db");

async function setupDataQuality() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS data_quality_checks (
        id SERIAL PRIMARY KEY,
        dataset_name VARCHAR(150) NOT NULL,
        score NUMERIC(5,2) NOT NULL,
        missing_values INTEGER DEFAULT 0,
        duplicate_records INTEGER DEFAULT 0,
        failed_rules INTEGER DEFAULT 0,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const countResult = await pool.query(
      "SELECT COUNT(*) AS count FROM data_quality_checks"
    );

    if (Number(countResult.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO data_quality_checks
          (dataset_name, score, missing_values, duplicate_records, failed_rules, status)
        VALUES
          ('Sales Data', 98.5, 12, 3, 0, 'Healthy'),
          ('Customer Data', 87.2, 145, 18, 2, 'Warning'),
          ('Finance Data', 72.4, 320, 9, 5, 'Critical'),
          ('Inventory Data', 94.8, 28, 6, 1, 'Healthy');
      `);
    }

    console.log("Data quality table and sample records are ready.");
  } catch (error) {
    console.error("Setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

setupDataQuality();