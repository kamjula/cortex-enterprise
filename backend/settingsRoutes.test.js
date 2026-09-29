const test = require("node:test");
const assert = require("node:assert/strict");
const { validateSettings, DEFAULTS } = require("./settingsRoutes");

test("supported preferences validate", () => {
  assert.equal(validateSettings(DEFAULTS), true);
  assert.equal(validateSettings({ theme: "Dark", alertNotifications: false }), true);
});
test("security controls cannot be falsely enabled via preferences", () => {
  assert.equal(validateSettings({ twoFactorAuth: true }), false);
  assert.equal(validateSettings({ slackIntegration: true }), false);
});
test("rejects invalid types and enum values", () => {
  assert.equal(validateSettings({ theme: "Unknown" }), false);
  assert.equal(validateSettings({ weeklyReports: "yes" }), false);
  assert.equal(validateSettings(null), false);
});
