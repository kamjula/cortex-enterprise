const express = require("express");
const bcrypt = require("bcrypt");
const { requirePermission } = require("./rbac");

const ALLOWED_ROLES = new Set(["Admin", "Editor", "Viewer"]);

function createUsersRouter(pool) {
  const router = express.Router();
  const adminOnly = requirePermission("admin");

  router.use(adminOnly);

  router.get("/", async (_req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, email, role, is_active, created_at
         FROM users ORDER BY created_at DESC, id DESC`
      );
      res.json(result.rows);
    } catch (error) {
      console.error("LIST USERS ERROR:", error.message);
      res.status(500).json({ error: "Could not load users" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const email = req.body.email?.trim().toLowerCase();
      const password = req.body.password;
      const role = req.body.role || "Viewer";
      if (!email || !email.includes("@")) return res.status(400).json({ error: "A valid email is required" });
      if (typeof password !== "string" || password.length < 12) return res.status(400).json({ error: "Password must be at least 12 characters" });
      if (!ALLOWED_ROLES.has(role)) return res.status(400).json({ error: "Role must be Admin, Editor, or Viewer" });

      const hash = await bcrypt.hash(password, 12);
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, role, is_active)
         VALUES ($1, $2, $3, TRUE)
         RETURNING id, email, role, is_active, created_at`,
        [email, hash, role]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      if (error.code === "23505") return res.status(409).json({ error: "A user with that email already exists" });
      console.error("CREATE USER ERROR:", error.message);
      res.status(500).json({ error: "Could not create user" });
    }
  });

  router.patch("/:id", async (req, res) => {
    let client;
    try {
      client = await pool.connect();
      await client.query("BEGIN");
      const existing = await client.query("SELECT id, role, is_active FROM users WHERE id = $1 FOR UPDATE", [req.params.id]);
      if (!existing.rows[0]) { await client.query("ROLLBACK"); return res.status(404).json({ error: "User not found" }); }

      const current = existing.rows[0];
      const role = req.body.role ?? current.role;
      const isActive = req.body.isActive ?? current.is_active;
      if (typeof isActive !== "boolean") {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "isActive must be a boolean" });
      }
      if (!ALLOWED_ROLES.has(role)) { await client.query("ROLLBACK"); return res.status(400).json({ error: "Role must be Admin, Editor, or Viewer" }); }
      if (String(req.user.id) === String(current.id) && (!isActive || role !== "Admin")) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "You cannot deactivate or remove your own Admin access" });
      }
      if (current.role === "Admin" && current.is_active && (role !== "Admin" || !isActive)) {
        const admins = await client.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'Admin' AND is_active = TRUE");
        if (admins.rows[0].count <= 1) { await client.query("ROLLBACK"); return res.status(400).json({ error: "CortexOS must keep at least one active Admin" }); }
      }

      const result = await client.query(
        `UPDATE users SET role = $1, is_active = $2 WHERE id = $3
         RETURNING id, email, role, is_active, created_at`,
        [role, Boolean(isActive), req.params.id]
      );
      if (role !== current.role || isActive !== current.is_active) {
        await client.query(
          "UPDATE auth_refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL",
          [req.params.id]
        );
      }
      await client.query("COMMIT");
      res.json(result.rows[0]);
    } catch (error) {
      if (client) await client.query("ROLLBACK").catch(() => {});
      console.error("UPDATE USER ERROR:", error.message);
      res.status(500).json({ error: "Could not update user" });
    } finally {
      if (client) client.release();
    }
  });

  return router;
}

module.exports = { createUsersRouter, ALLOWED_ROLES };
