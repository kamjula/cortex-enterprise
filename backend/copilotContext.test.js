const test = require("node:test");
const assert = require("node:assert/strict");

const {
  ALL_SQL_STATEMENTS,
  buildOperationalContext,
  formatOperationalContext,
  isContextEnabled,
  composeCopilotRequest,
} = require("./copilotContext");

function aggregatePool() {
  const queries = [];
  const responses = [
    [{ status: "Healthy", count: 3 }],
    [{ status: "Failed", count: 1 }],
    [{ status: "Open", severity: "High", count: 2 }],
    [{ status: "Warning", count: 1 }],
    [{ average_score: "88.50", minimum_score: "72.40" }],
  ];

  return {
    queries,
    pool: {
      async query(sql, params) {
        queries.push({ sql, params });
        return { rows: responses.shift() };
      },
    },
  };
}

test("context uses fixed aggregate SELECT statements without sensitive columns", () => {
  const forbidden = [
    "owner", "pipeline_name", "source", "destination",
    "title", "message", "dataset_name", "ai_chat",
  ];

  assert.equal(ALL_SQL_STATEMENTS.length, 5);
  for (const sql of ALL_SQL_STATEMENTS) {
    assert.match(sql, /^\s*SELECT\b/i);
    assert.match(sql, /COUNT|AVG|MIN/i);
    assert.doesNotMatch(sql, /\b(INSERT|UPDATE|DELETE|DROP|ALTER)\b/i);
    for (const column of forbidden) {
      assert.doesNotMatch(sql, new RegExp(`\\b${column}\\b`, "i"));
    }
  }
});

test("buildOperationalContext returns aggregate values only", async () => {
  const { pool, queries } = aggregatePool();
  const context = await buildOperationalContext(pool);

  assert.equal(queries.length, 5);
  assert.ok(queries.every(({ params }) => Array.isArray(params) && params.length === 0));
  assert.deepEqual(context.datasetsByStatus, [{ status: "Healthy", count: 3 }]);
  assert.deepEqual(context.pipelinesByStatus, [{ status: "Failed", count: 1 }]);
  assert.deepEqual(context.alertsByStatusAndSeverity, [
    { status: "Open", severity: "High", count: 2 },
  ]);
  assert.deepEqual(context.dataQualityScoreSummary, {
    average: 88.5,
    minimum: 72.4,
  });
});

test("context is disabled by default and requires the exact value true", () => {
  assert.equal(isContextEnabled({}), false);
  assert.equal(isContextEnabled({ COPILOT_CONTEXT_ENABLED: "false" }), false);
  assert.equal(isContextEnabled({ COPILOT_CONTEXT_ENABLED: "TRUE" }), false);
  assert.equal(isContextEnabled({ COPILOT_CONTEXT_ENABLED: "true" }), true);
});

test("disabled context performs no database query", async () => {
  const pool = {
    query() {
      throw new Error("query must not run");
    },
  };

  const result = await composeCopilotRequest({
    pool,
    prompt: "hello",
    systemPrompt: "system",
    contextEnabled: false,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.messages, [
    { role: "system", content: "system" },
    { role: "user", content: "hello" },
  ]);
});

test("enabled context adds only the sanitized aggregate snapshot", async () => {
  const { pool } = aggregatePool();
  const result = await composeCopilotRequest({
    pool,
    prompt: "How many alerts are open?",
    systemPrompt: "system",
    contextEnabled: true,
  });

  assert.equal(result.ok, true);
  assert.equal(result.messages.length, 3);
  assert.match(result.messages[1].content, /aggregate counts/);
  assert.match(result.messages[1].content, /"count":2/);
  assert.doesNotMatch(result.messages[1].content, /dataset owner|alert message/i);
});

test("context retrieval failure fails closed before an OpenAI request can be composed", async () => {
  const result = await composeCopilotRequest({
    pool: { query: async () => { throw new Error("database unavailable"); } },
    prompt: "How many alerts are open?",
    systemPrompt: "system",
    contextEnabled: true,
  });

  assert.deepEqual(result, {
    ok: false,
    error: "AI Copilot operational context is unavailable right now.",
  });
  assert.equal(result.messages, undefined);
});

test("formatted context states privacy and pipeline limitations", () => {
  const message = formatOperationalContext({ datasetsByStatus: [] });

  assert.match(message, /aggregate counts and summary statistics/);
  assert.match(message, /read-only data/);
  assert.match(message, /no orchestration engine/);
});
