import { useEffect, useMemo, useRef, useState } from "react";

const suggestedQuestions = [
  "Which datasets have data quality issues?",
  "Show me the latest pipeline failures.",
  "Are there any open alerts?",
  "Which dataset has the lowest quality score?",
];

const sampleResponses = {
  dataset:
    "Customer Data, Sales Data, Inventory Data, and Finance Data are currently available in CortexOS. Customer Data requires the most attention because it contains missing values.",

  quality:
    "Customer Data has the lowest quality score. The main issues are missing values, duplicate records, and failed validation rules.",

  pipeline:
    "The Finance ETL pipeline recently reported a failure. Other pipelines are currently operating normally.",

  alert:
    "There is one active alert: API Timeout. Its severity is High and its current status is Open.",

  default:
    "I can help analyze datasets, pipelines, data quality checks, and platform alerts. Ask a question about the CortexOS environment.",
};

function AICopilot() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const conversationEndRef = useRef(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5050/copilot");

      if (!response.ok) {
        throw new Error("Failed to load Copilot history");
      }

      const data = await response.json();

      const formattedHistory = Array.isArray(data)
        ? data
            .map((item) => [
              {
                id: `user-${item.id}`,
                role: "user",
                content: item.question,
              },
              {
                id: `assistant-${item.id}`,
                role: "assistant",
                content: item.answer,
              },
            ])
            .flat()
            .reverse()
        : [];

      setHistory(formattedHistory);
    } catch (err) {
      console.error("Copilot fetch error:", err);
      setError(err.message || "Could not load Copilot history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [history]);

  const recentPrompts = useMemo(() => {
    return history
      .filter((item) => item.role === "user")
      .slice(-5)
      .reverse();
  }, [history]);

  const createAIResponse = (question) => {
    const normalizedQuestion = question.toLowerCase();

    if (
      normalizedQuestion.includes("quality") ||
      normalizedQuestion.includes("lowest score") ||
      normalizedQuestion.includes("missing") ||
      normalizedQuestion.includes("duplicate")
    ) {
      return sampleResponses.quality;
    }

    if (
      normalizedQuestion.includes("pipeline") ||
      normalizedQuestion.includes("etl") ||
      normalizedQuestion.includes("failure")
    ) {
      return sampleResponses.pipeline;
    }

    if (
      normalizedQuestion.includes("alert") ||
      normalizedQuestion.includes("open") ||
      normalizedQuestion.includes("timeout")
    ) {
      return sampleResponses.alert;
    }

    if (
      normalizedQuestion.includes("dataset") ||
      normalizedQuestion.includes("records")
    ) {
      return sampleResponses.dataset;
    }

    return sampleResponses.default;
  };

  const sendMessage = async (questionFromSuggestion) => {
    const question = (
      questionFromSuggestion || input
    ).trim();

    if (!question || sending) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
    };

    setHistory((current) => [...current, userMessage]);
    setInput("");
    setSending(true);
    setError("");

    await new Promise((resolve) => {
      setTimeout(resolve, 700);
    });

    const aiMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: createAIResponse(question),
    };

    setHistory((current) => [...current, aiMessage]);
    setSending(false);
  };

  const clearChat = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear this chat?"
    );

    if (!confirmed) {
      return;
    }

    setHistory([]);
    setInput("");
    setError("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>AI Copilot</h2>

          <p style={styles.subtitle}>
            Ask questions about datasets, pipelines, data quality,
            and platform alerts.
          </p>
        </div>

        <button
          type="button"
          onClick={clearChat}
          style={styles.clearButton}
        >
          Clear Chat
        </button>
      </div>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>
              Suggested Questions
            </h3>

            <div style={styles.suggestionList}>
              {suggestedQuestions.map((question) => (
                <button
                  type="button"
                  key={question}
                  onClick={() => sendMessage(question)}
                  style={styles.suggestionButton}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>
              Recent Prompts
            </h3>

            {recentPrompts.length === 0 ? (
              <p style={styles.emptyRecent}>
                No recent prompts.
              </p>
            ) : (
              <div style={styles.recentList}>
                {recentPrompts.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setInput(item.content)}
                    style={styles.recentButton}
                  >
                    {item.content}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <section style={styles.chatCard}>
          <div style={styles.chatHeader}>
            <div style={styles.aiIcon}>AI</div>

            <div>
              <h3 style={styles.chatTitle}>
                CortexOS Assistant
              </h3>

              <p style={styles.onlineText}>
                Online and ready to help
              </p>
            </div>
          </div>

          <div style={styles.conversation}>
            {error && (
              <div style={styles.errorCard}>{error}</div>
            )}

            {loading ? (
              <div style={styles.loadingState}>
                Loading conversation...
              </div>
            ) : history.length === 0 ? (
              <div style={styles.welcomeState}>
                <div style={styles.welcomeIcon}>✦</div>

                <h3 style={styles.welcomeTitle}>
                  Welcome to CortexOS AI Copilot
                </h3>

                <p style={styles.welcomeText}>
                  Ask a question or select one of the suggested
                  prompts to begin.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    ...styles.messageRow,
                    justifyContent:
                      item.role === "user"
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <div
                    style={
                      item.role === "user"
                        ? styles.userMessage
                        : styles.aiMessage
                    }
                  >
                    <div style={styles.messageLabel}>
                      {item.role === "user"
                        ? "You"
                        : "CortexOS AI"}
                    </div>

                    <div style={styles.messageText}>
                      {item.content}
                    </div>
                  </div>
                </div>
              ))
            )}

            {sending && (
              <div
                style={{
                  ...styles.messageRow,
                  justifyContent: "flex-start",
                }}
              >
                <div style={styles.aiMessage}>
                  <div style={styles.messageLabel}>
                    CortexOS AI
                  </div>

                  <div style={styles.typingText}>
                    Analyzing your request...
                  </div>
                </div>
              </div>
            )}

            <div ref={conversationEndRef} />
          </div>

          <div style={styles.inputArea}>
            <textarea
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask CortexOS about your data..."
              rows={2}
              style={styles.promptInput}
            />

            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={!input.trim() || sending}
              style={{
                ...styles.sendButton,
                opacity:
                  !input.trim() || sending ? 0.6 : 1,
              }}
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>

          <p style={styles.inputHint}>
            Press Enter to send. Use Shift + Enter for a new
            line.
          </p>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "8px 0 32px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    color: "#111827",
    fontSize: "30px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#6B7280",
  },

  clearButton: {
    border: "1px solid #D1D5DB",
    borderRadius: "10px",
    padding: "10px 16px",
    background: "#FFFFFF",
    color: "#374151",
    fontWeight: 600,
    cursor: "pointer",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "280px minmax(0, 1fr)",
    gap: "20px",
    alignItems: "start",
  },

  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  sidebarCard: {
    padding: "18px",
    border: "1px solid #E5E7EB",
    borderRadius: "14px",
    background: "#FFFFFF",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
  },

  sidebarTitle: {
    margin: "0 0 14px",
    color: "#111827",
    fontSize: "16px",
  },

  suggestionList: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  suggestionButton: {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #DBEAFE",
    borderRadius: "9px",
    background: "#EFF6FF",
    color: "#1D4ED8",
    textAlign: "left",
    lineHeight: 1.4,
    cursor: "pointer",
  },

  recentList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  recentButton: {
    width: "100%",
    padding: "9px 0",
    border: "none",
    borderBottom: "1px solid #E5E7EB",
    background: "transparent",
    color: "#4B5563",
    textAlign: "left",
    cursor: "pointer",
  },

  emptyRecent: {
    margin: 0,
    color: "#9CA3AF",
    fontSize: "14px",
  },

  chatCard: {
    overflow: "hidden",
    border: "1px solid #E5E7EB",
    borderRadius: "16px",
    background: "#FFFFFF",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
  },

  chatHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "17px 20px",
    borderBottom: "1px solid #E5E7EB",
  },

  aiIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#2563EB",
    color: "#FFFFFF",
    fontWeight: 800,
  },

  chatTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "16px",
  },

  onlineText: {
    margin: "4px 0 0",
    color: "#16A34A",
    fontSize: "13px",
  },

  conversation: {
    minHeight: "470px",
    maxHeight: "570px",
    overflowY: "auto",
    padding: "22px",
    background: "#F8FAFC",
  },

  welcomeState: {
    display: "flex",
    minHeight: "420px",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    textAlign: "center",
  },

  welcomeIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "60px",
    height: "60px",
    marginBottom: "16px",
    borderRadius: "18px",
    background: "#DBEAFE",
    color: "#2563EB",
    fontSize: "28px",
  },

  welcomeTitle: {
    margin: 0,
    color: "#111827",
  },

  welcomeText: {
    maxWidth: "420px",
    margin: "10px 0 0",
    color: "#6B7280",
    lineHeight: 1.6,
  },

  messageRow: {
    display: "flex",
    marginBottom: "16px",
  },

  userMessage: {
    maxWidth: "72%",
    padding: "13px 15px",
    borderRadius: "14px 14px 4px 14px",
    background: "#2563EB",
    color: "#FFFFFF",
  },

  aiMessage: {
    maxWidth: "76%",
    padding: "13px 15px",
    border: "1px solid #E5E7EB",
    borderRadius: "14px 14px 14px 4px",
    background: "#FFFFFF",
    color: "#374151",
  },

  messageLabel: {
    marginBottom: "5px",
    fontSize: "12px",
    fontWeight: 700,
    opacity: 0.85,
  },

  messageText: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.55,
  },

  typingText: {
    color: "#6B7280",
    fontStyle: "italic",
  },

  loadingState: {
    padding: "40px",
    color: "#6B7280",
    textAlign: "center",
  },

  errorCard: {
    marginBottom: "16px",
    padding: "12px 14px",
    border: "1px solid #FECACA",
    borderRadius: "10px",
    background: "#FEF2F2",
    color: "#991B1B",
  },

  inputArea: {
    display: "flex",
    alignItems: "flex-end",
    gap: "12px",
    padding: "16px 18px 8px",
    borderTop: "1px solid #E5E7EB",
  },

  promptInput: {
    boxSizing: "border-box",
    width: "100%",
    minHeight: "48px",
    padding: "12px 14px",
    border: "1px solid #D1D5DB",
    borderRadius: "10px",
    resize: "none",
    fontFamily: "inherit",
    fontSize: "14px",
  },

  sendButton: {
    minWidth: "90px",
    height: "48px",
    border: "none",
    borderRadius: "10px",
    background: "#2563EB",
    color: "#FFFFFF",
    fontWeight: 700,
    cursor: "pointer",
  },

  inputHint: {
    margin: 0,
    padding: "0 18px 14px",
    color: "#9CA3AF",
    fontSize: "12px",
  },
};

export default AICopilot;