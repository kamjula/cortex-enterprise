const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CortexOS Backend Running");
});

app.get("/dashboard", async (req, res) => {
  try {
    const total = await pool.query("SELECT COUNT(*) AS count FROM datasets");
    const healthy = await pool.query("SELECT COUNT(*) AS count FROM datasets WHERE status='Healthy'");
    const warning = await pool.query("SELECT COUNT(*) AS count FROM datasets WHERE status='Warning'");
    const records = await pool.query("SELECT COALESCE(SUM(records),0) AS total_records FROM datasets");

    res.json({
      totalDatasets: Number(total.rows[0].count),
      healthy: Number(healthy.rows[0].count),
      warning: Number(warning.rows[0].count),
      totalRecords: Number(records.rows[0].total_records),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/datasets", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM datasets ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/pipelines", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pipelines ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/copilot", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ai_chat ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("COPILOT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});
app.get("/data-quality", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        dataset_name,
        score,
        missing_values,
        duplicate_records,
        failed_rules,
        status,
        created_at
      FROM data_quality_checks
      ORDER BY id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("DATA QUALITY ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});
const PORT = 5050;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});