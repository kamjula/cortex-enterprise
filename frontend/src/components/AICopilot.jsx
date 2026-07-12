import { useEffect, useState } from "react";

function AICopilot() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");

  const fetchHistory = () => {
    fetch("http://localhost:5050/copilot")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error("Copilot Fetch Error:", err));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={{ marginTop: 24, fontFamily: "Inter, sans-serif" }}>
      <h2>🤖 CortexOS AI Copilot</h2>
      <p style={{ color: "#64748b" }}>
        AI-assisted insights from datasets, pipelines, alerts, and data quality.
      </p>

      <div style={{ background: "white", padding: 20, borderRadius: 16 }}>
        {history.map((item) => (
          <div key={item.id} style={{ marginBottom: 20 }}>
            <strong>You:</strong>
            <p>{item.question}</p>

            <strong>AI:</strong>
            <p style={{ color: "#334155" }}>{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AICopilot;