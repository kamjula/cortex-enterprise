require("dotenv").config();
const pool = require("./db");

async function setupAlerts() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        severity VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'Open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const countResult = await pool.query(
      "SELECT COUNT(*) AS count FROM alerts"
    );

    if (Number(countResult.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO alerts (title, severity, message, status)
        VALUES
          (
            'Pipeline Failure',
            'High',
            'Customer ETL pipeline failed during transformation.',
            'Open'
          ),
          (
            'Data Quality Warning',
            'Medium',
            'Customer Data quality score dropped below 90%.',
            'Open'
          ),
          (
            'Dataset Updated',
            'Low',
            'Inventory Data was refreshed successfully.',
            'Resolved'
          );
      `);
    }

    console.log("Alerts table and sample records are ready.");
  } catch (error) {
    console.error("Alerts setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

setupAlerts();