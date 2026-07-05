const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// ----------------------
// Test Route
// ----------------------
app.get("/", (req, res) => {
  res.send("🚀 CortexOS Backend Running");
});

// ----------------------
// Get All Datasets
// ----------------------
app.get("/datasets", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM datasets ORDER BY id"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

// ----------------------
// Add Dataset
// ----------------------
app.post("/datasets", async (req, res) => {
  try {
    const { name, owner, records, status } = req.body;

    await pool.query(
      `INSERT INTO datasets(name, owner, records, status)
       VALUES($1,$2,$3,$4)`,
      [name, owner, records, status]
    );

    res.json({
      message: "Dataset Added Successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

// ----------------------
// Update Dataset
// ----------------------
app.put("/datasets/:id", async (req, res) => {
  try {
    const { name, owner, records, status } = req.body;

    await pool.query(
      `UPDATE datasets
       SET name=$1,
           owner=$2,
           records=$3,
           status=$4
       WHERE id=$5`,
      [
        name,
        owner,
        records,
        status,
        req.params.id,
      ]
    );

    res.json({
      message: "Dataset Updated Successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

// ----------------------
// Delete Dataset
// ----------------------
app.delete("/datasets/:id", async (req, res) => {
  try {

    await pool.query(
      "DELETE FROM datasets WHERE id=$1",
      [req.params.id]
    );

    res.json({
      message: "Dataset Deleted Successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

const PORT = 5050;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});