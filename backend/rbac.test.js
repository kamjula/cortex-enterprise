const test = require("node:test");
const assert = require("node:assert/strict");
const { can, requirePermission } = require("./rbac");

test("Viewer can read but cannot mutate resources", () => {
  assert.equal(can("Viewer", "read"), true);
  assert.equal(can("Viewer", "operate"), false);
  assert.equal(can("Viewer", "write"), false);
  assert.equal(can("Viewer", "delete"), false);
  assert.equal(can("Viewer", "admin"), false);
});

test("Editor can read, operate, and write but cannot delete/administer", () => {
  assert.equal(can("Editor", "read"), true);
  assert.equal(can("Editor", "operate"), true);
  assert.equal(can("Editor", "write"), true);
  assert.equal(can("Editor", "delete"), false);
  assert.equal(can("Editor", "admin"), false);
});

test("Admin receives the complete permission set", () => {
  for (const permission of ["read", "operate", "write", "delete", "admin"]) {
    assert.equal(can("Admin", permission), true);
  }
});

test("unknown roles receive no permissions", () => {
  assert.equal(can("Owner", "read"), false);
  assert.equal(can(undefined, "read"), false);
});

test("requirePermission returns 403 when the authenticated role lacks permission", () => {
  const middleware = requirePermission("delete");
  const req = { user: { role: "Editor" } };
  let statusCode;
  let body;
  let nextCalled = false;
  const res = {
    status(code) { statusCode = code; return this; },
    json(value) { body = value; return this; },
  };

  middleware(req, res, () => { nextCalled = true; });
  assert.equal(statusCode, 403);
  assert.equal(body.error, "Forbidden");
  assert.equal(nextCalled, false);
});

test("requirePermission passes authorized roles to the route", () => {
  const middleware = requirePermission("write");
  const req = { user: { role: "Editor" } };
  let nextCalled = false;
  middleware(req, {}, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
});
