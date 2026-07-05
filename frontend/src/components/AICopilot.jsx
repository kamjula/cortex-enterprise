import { useState } from "react";

function AICopilot() {
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "Hello! I'm CortexOS AI Copilot. Ask me anything about your data platform.",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "You",
      text: input,
    };

    const aiMessage = {
      sender: "AI",
      text: `You asked: "${input}". Backend integration will be added in the next phase.`,
    };

    setMessages([...messages, userMessage, aiMessage]);
    setInput("");
  };

  return (
    <div
      style={{
        background: "white",
        padding: 24,
        borderRadius: 16,
        marginTop: 30,
      }}
    >
      <h2>🤖 CortexOS AI Copilot</h2>

      <div
        style={{
          height: 350,
          overflowY: "auto",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: 15,
          marginTop: 20,
          marginBottom: 20,
          background: "#f8fafc",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: 15 }}>
            <strong>{msg.sender}:</strong>
            <p style={{ marginTop: 5 }}>{msg.text}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="Ask about datasets, pipelines, or quality..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #d1d5db",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default AICopilot;