"use strict";

// Uses Node's built-in fetch; no extra package or client-side key required.
// The Gemini key is passed in a request header, never in a URL or log.
async function generateGeminiReply(messages, { env = process.env, fetchImpl = fetch } = {}) {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key is not configured");

  const model = env.GEMINI_MODEL || "gemini-2.5-flash";
  if (!/^[a-zA-Z0-9._-]+$/.test(model)) throw new Error("Invalid Gemini model name");

  const systemText = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n");
  const userText = messages.filter(m => m.role === "user").map(m => m.content).join("\n\n");

  const response = await fetchImpl(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemText }] },
        contents: [{ role: "user", parts: [{ text: userText }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
      }),
      signal: AbortSignal.timeout(25000),
    }
  );

  if (!response.ok) {
    // Never log API responses: they can contain sensitive request metadata.
    console.error("GEMINI COPILOT ERROR: HTTP", response.status);
    throw new Error("Gemini provider request failed");
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts
    ?.filter(part => typeof part.text === "string")
    .map(part => part.text)
    .join("\n")
    .trim();
  if (!reply) throw new Error("Gemini returned no text");
  return reply;
}

module.exports = { generateGeminiReply };
