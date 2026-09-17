const test = require("node:test");
const assert = require("node:assert/strict");

process.env.JWT_SECRET = "test-access-secret-at-least-32-characters";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-at-least-32-characters";
process.env.JWT_ACCESS_TTL = "5m";
process.env.JWT_REFRESH_TTL = "1h";

const {
  issueAccessToken,
  issueRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  requireAuth,
} = require("./auth");

const user = { id: 7, email: "admin@example.com", role: "Admin" };

test("issues and verifies access token", () => {
  const token = issueAccessToken(user);
  const payload = verifyAccessToken(token);
  assert.equal(payload.sub, "7");
  assert.equal(payload.email, user.email);
  assert.equal(payload.role, "Admin");
  assert.equal(payload.type, "access");
});

test("issues and verifies refresh token", () => {
  const token = issueRefreshToken(user);
  const payload = verifyRefreshToken(token);
  assert.equal(payload.sub, "7");
  assert.equal(payload.type, "refresh");
  assert.ok(payload.jti);
});

test("issues unique refresh tokens", () => {
  const first = issueRefreshToken(user);
  const second = issueRefreshToken(user);
  assert.notEqual(first, second);
  assert.notEqual(verifyRefreshToken(first).jti, verifyRefreshToken(second).jti);
});

test("rejects refresh token as access token", () => {
  const token = issueRefreshToken(user);
  assert.throws(() => verifyAccessToken(token));
});

test("requireAuth accepts valid bearer token", () => {
  const token = issueAccessToken(user);
  const req = { headers: { authorization: `Bearer ${token}` } };
  let statusCode = null;
  let body = null;
  let nextCalled = false;
  const res = {
    status(code) { statusCode = code; return this; },
    json(value) { body = value; return this; },
  };
  requireAuth(req, res, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
  assert.equal(statusCode, null);
  assert.equal(body, null);
  assert.equal(req.user.sub, "7");
});

test("requireAuth rejects missing token", () => {
  const req = { headers: {} };
  let statusCode = null;
  let body = null;
  const res = {
    status(code) { statusCode = code; return this; },
    json(value) { body = value; return this; },
  };
  requireAuth(req, res, () => {});
  assert.equal(statusCode, 401);
  assert.equal(body.error, "Authentication required");
});

test("requireAuth rejects malformed bearer header", () => {
  const req = { headers: { authorization: "Bearer token with spaces" } };
  let statusCode = null;
  const res = {
    status(code) { statusCode = code; return this; },
    json() { return this; },
  };
  requireAuth(req, res, () => assert.fail("next should not be called"));
  assert.equal(statusCode, 401);
});
