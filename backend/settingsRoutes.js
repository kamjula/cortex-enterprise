const express = require("express");

const DEFAULTS = Object.freeze({
  emailNotifications: false,
  alertNotifications: true,
  pipelineNotifications: false,
  weeklyReports: false,
  theme: "Light",
  density: "Comfortable",
  language: "English",
});
const OPTIONS = { theme: ["Light", "Dark", "System"], density: ["Compact", "Comfortable", "Spacious"], language: ["English", "Spanish", "French"] };

function validateSettings(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.keys(value).every(key => Object.hasOwn(DEFAULTS, key) &&
    (Object.hasOwn(OPTIONS, key) ? OPTIONS[key].includes(value[key]) : typeof value[key] === "boolean"));
}

function createSettingsRouter(pool) {
  const router = express.Router();
  router.get("/", async (req, res) => {
    try {
      const result = await pool.query("SELECT preferences FROM user_settings WHERE user_id = $1", [req.user.id]);
      return res.json({ ...DEFAULTS, ...(result.rows[0]?.preferences || {}) });
    } catch (error) {
      console.error("LOAD SETTINGS ERROR:", error.message);
      return res.status(503).json({ error: "Settings unavailable" });
    }
  });
  router.put("/", async (req, res) => {
    if (!validateSettings(req.body)) return res.status(400).json({ error: "Invalid settings" });
    try {
      const preferences = { ...DEFAULTS, ...req.body };
      const result = await pool.query(
        `INSERT INTO user_settings (user_id, preferences) VALUES ($1, $2::jsonb)
         ON CONFLICT (user_id) DO UPDATE SET preferences = EXCLUDED.preferences, updated_at = NOW()
         RETURNING preferences`,
        [req.user.id, JSON.stringify(preferences)]
      );
      return res.json(result.rows[0].preferences);
    } catch (error) {
      console.error("SAVE SETTINGS ERROR:", error.message);
      return res.status(503).json({ error: "Settings unavailable" });
    }
  });
  return router;
}

module.exports = { createSettingsRouter, validateSettings, DEFAULTS };
