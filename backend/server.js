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
    const total = await pool.query(
      "SELECT COUNT(*) AS count FROM datasets"
    );

    const healthy = await pool.query(
      "SELECT COUNT(*) AS count FROM datasets WHERE status = 'Healthy'"
    );

    const warning = await pool.query(
      "SELECT COUNT(*) AS count FROM datasets WHERE status = 'Warning'"
    );

    const records = await pool.query(
      "SELECT COALESCE(SUM(records), 0) AS total_records FROM datasets"
    );

    res.json({
      totalDatasets: Number(total.rows[0].count),
      healthy: Number(healthy.rows[0].count),
      warning: Number(warning.rows[0].count),
      totalRecords: Number(records.rows[0].total_records),
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/datasets", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM datasets ORDER BY id"
    );

    res.json(result.rows);
  } catch (err) {
    console.error("DATASETS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/pipelines", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pipelines ORDER BY id"
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET PIPELINES ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/pipelines/:id/logs", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM pipelines WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Pipeline not found",
      });
    }

    const pipeline = result.rows[0];

    const logs = [
      {
        timestamp: new Date().toISOString(),
        level: "INFO",
        message: `${pipeline.pipeline_name} pipeline selected.`,
      },
      {
        timestamp: new Date().toISOString(),
        level: "INFO",
        message: `Reading data from ${pipeline.source}.`,
      },
      {
        timestamp: new Date().toISOString(),
        level:
          pipeline.status === "Failed"
            ? "ERROR"
            : "SUCCESS",
        message:
          pipeline.status === "Failed"
            ? `Pipeline execution failed before loading data into ${pipeline.destination}.`
            : `Pipeline completed with status ${pipeline.status}.`,
      },
    ];

    res.json({
      pipeline,
      logs,
    });
  } catch (err) {
    console.error("PIPELINE LOGS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.patch("/pipelines/:id/trigger", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        UPDATE pipelines
        SET status = 'Running'
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Pipeline not found",
      });
    }

    res.json({
      message: "Pipeline triggered successfully",
      pipeline: result.rows[0],
    });
  } catch (err) {
    console.error("TRIGGER PIPELINE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.patch("/pipelines/:id/retry", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        UPDATE pipelines
        SET status = 'Running'
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Pipeline not found",
      });
    }

    res.json({
      message: "Pipeline retry started",
      pipeline: result.rows[0],
    });
  } catch (err) {
    console.error("RETRY PIPELINE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/copilot", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ai_chat ORDER BY id DESC"
    );

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

app.get("/alerts", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM alerts ORDER BY created_at DESC, id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET ALERTS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/alerts", async (req, res) => {
  try {
    const {
      title,
      severity,
      message,
      status = "Open",
    } = req.body;

    if (!title || !severity || !message) {
      return res.status(400).json({
        error: "Title, severity, and message are required",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO alerts (
          title,
          severity,
          message,
          status
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [title, severity, message, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("CREATE ALERT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.put("/alerts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      severity,
      message,
      status,
    } = req.body;

    if (!title || !severity || !message || !status) {
      return res.status(400).json({
        error: "Title, severity, message, and status are required",
      });
    }

    const result = await pool.query(
      `
        UPDATE alerts
        SET
          title = $1,
          severity = $2,
          message = $3,
          status = $4
        WHERE id = $5
        RETURNING *
      `,
      [title, severity, message, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Alert not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE ALERT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.patch("/alerts/:id/resolve", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        UPDATE alerts
        SET status = 'Resolved'
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Alert not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("RESOLVE ALERT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/alerts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        DELETE FROM alerts
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Alert not found",
      });
    }

    res.json({
      message: "Alert deleted successfully",
      alert: result.rows[0],
    });
  } catch (err) {
    console.error("DELETE ALERT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});