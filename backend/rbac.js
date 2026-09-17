const ROLE_PERMISSIONS = Object.freeze({
  Viewer: new Set(["read"]),
  Editor: new Set(["read", "operate", "write"]),
  Admin: new Set(["read", "operate", "write", "delete", "admin"]),
});

function can(role, permission) {
  return Boolean(ROLE_PERMISSIONS[role]?.has(permission));
}

function requirePermission(permission) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!can(role, permission)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `The ${role || "unknown"} role does not have ${permission} permission.`,
      });
    }
    return next();
  };
}

module.exports = { ROLE_PERMISSIONS, can, requirePermission };
