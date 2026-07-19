require("dotenv").config();
const pool = require("./db");

async function setupCoreTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS datasets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        owner VARCHAR(150) NOT NULL,
        records INTEGER NOT NULL DEFAULT 0,
        status VARCHAR(20) NOT NULL DEFAULT 'Healthy',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS pipelines (
        id SERIAL PRIMARY KEY,
        pipeline_name VARCHAR(150) NOT NULL,
        source VARCHAR(150) NOT NULL,
        destination VARCHAR(150) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Success',
        last_run TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const datasetCount = await pool.query(
      "SELECT COUNT(*) AS count FROM datasets"
    );

    if (Number(datasetCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO datasets (name, owner, records, status)
        VALUES
          ('Sales Data', 'Sravani', 120000, 'Healthy'),
          ('Customer Data', 'Analytics Team', 85000, 'Warning'),
          ('Finance Data', 'Finance', 45000, 'Healthy'),
          ('Inventory Data', 'Operations', 50000, 'Healthy');
      `);
    }

    const pipelineCount = await pool.query(
      "SELECT COUNT(*) AS count FROM pipelines"
    );

    if (Number(pipelineCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO pipelines (pipeline_name, source, destination, status, last_run)
        VALUES
          ('Sales ETL', 'Sales DB', 'Warehouse', 'Success', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
          ('Customer Sync', 'CRM API', 'Analytics Lake', 'Running', CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
          ('Finance Snapshot', 'Finance DB', 'Reporting Layer', 'Failed', CURRENT_TIMESTAMP - INTERVAL '1 day'),
          ('Inventory Refresh', 'Inventory DB', 'Operations Hub', 'Success', CURRENT_TIMESTAMP - INTERVAL '3 hours');
      `);
    }

    console.log("Core tables are ready.");
  } catch (error) {
    console.error("Core table setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

setupCoreTables();
