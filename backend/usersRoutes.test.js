const test = require("node:test");
const assert = require("node:assert/strict");
const { ALLOWED_ROLES } = require("./usersRoutes");

test("User Management exposes only the production RBAC roles", () => {
  assert.deepEqual([...ALLOWED_ROLES].sort(), ["Admin", "Editor", "Viewer"]);
});

test("legacy prototype roles are not accepted", () => {
  assert.equal(ALLOWED_ROLES.has("Data Engineer"), false);
  assert.equal(ALLOWED_ROLES.has("Data Analyst"), false);
});
