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
        <div style={styles.headerContent}>
          <div style={styles.titleWrap}>
            <h2 style={styles.title}>AI Copilot</h2>
            <span style={styles.badge}>Live workspace assistant</span>
          </div>

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
            <div style={styles.sidebarHeading}>
              <h3 style={styles.sidebarTitle}>
                Suggested Questions
              </h3>
              <span style={styles.sidebarPill}>Quick start</span>
            </div>

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

            <div style={styles.chatIdentity}>
              <h3 style={styles.chatTitle}>
                CortexOS Assistant
              </h3>

              <div style={styles.onlineRow}>
                <span style={styles.onlineDot} />
                <p style={styles.onlineText}>
                  Online and ready to help
                </p>
              </div>
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
    maxWidth: "100%",
    padding: "10px 0 32px",
    background: "linear-gradient(180deg, #F8FBFF 0%, #F5F8FC 100%)",
    borderRadius: "22px",
    overflowX: "hidden",
  },

  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "22px",
    padding: "0 4px",
  },

  headerContent: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  titleWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  title: {
    margin: 0,
    color: "#0F172A",
    fontSize: "30px",
    letterSpacing: "-0.02em",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 10px",
    borderRadius: "999px",
    background: "#DBEAFE",
    color: "#1D4ED8",
    fontSize: "12px",
    fontWeight: 700,
  },

  subtitle: {
    margin: 0,
    color: "#64748B",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  clearButton: {
    border: "1px solid #CBD5E1",
    borderRadius: "12px",
    padding: "11px 16px",
    background: "#FFFFFF",
    color: "#0F172A",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 300px) minmax(0, 1fr)",
    gap: "20px",
    alignItems: "start",
    width: "100%",
    maxWidth: "100%",
  },

  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    minWidth: 0,
    maxWidth: "100%",
  },

  sidebarCard: {
    padding: "18px",
    border: "1px solid #E2E8F0",
    borderRadius: "18px",
    background: "#FFFFFF",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
    minWidth: 0,
    maxWidth: "100%",
  },

  sidebarHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "14px",
  },

  sidebarTitle: {
    margin: 0,
    color: "#0F172A",
    fontSize: "16px",
  },

  sidebarPill: {
    padding: "4px 8px",
    borderRadius: "999px",
    background: "#EFF6FF",
    color: "#2563EB",
    fontSize: "11px",
    fontWeight: 700,
  },

  suggestionList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  suggestionButton: {
    width: "100%",
    maxWidth: "100%",
    padding: "12px 13px",
    border: "1px solid #BFDBFE",
    borderRadius: "12px",
    background: "#EFF6FF",
    color: "#1D4ED8",
    textAlign: "left",
    lineHeight: 1.45,
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.45)",
    overflowWrap: "anywhere",
  },

  recentList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  recentButton: {
    width: "100%",
    padding: "9px 10px",
    border: "none",
    borderBottom: "1px solid #E2E8F0",
    background: "transparent",
    color: "#475569",
    textAlign: "left",
    cursor: "pointer",
    lineHeight: 1.5,
  },

  emptyRecent: {
    margin: 0,
    color: "#94A3B8",
    fontSize: "14px",
  },

  chatCard: {
    overflow: "hidden",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    background: "#FFFFFF",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
    minWidth: 0,
    maxWidth: "100%",
  },

  chatHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "18px 20px",
    borderBottom: "1px solid #E2E8F0",
    background: "linear-gradient(135deg, #F8FBFF 0%, #F1F5F9 100%)",
  },

  aiIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
    color: "#FFFFFF",
    fontWeight: 800,
    boxShadow: "0 12px 24px rgba(37, 99, 235, 0.28)",
  },

  chatIdentity: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  chatTitle: {
    margin: 0,
    color: "#0F172A",
    fontSize: "16px",
  },

  onlineRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  onlineDot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    background: "#22C55E",
    boxShadow: "0 0 0 4px rgba(34, 197, 94, 0.18)",
  },

  onlineText: {
    margin: 0,
    color: "#15803D",
    fontSize: "13px",
    fontWeight: 600,
  },

  conversation: {
    minHeight: "470px",
    maxHeight: "570px",
    overflowY: "auto",
    padding: "22px",
    background: "linear-gradient(180deg, #F8FAFC 0%, #F5F7FB 100%)",
    minWidth: 0,
    maxWidth: "100%",
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
    width: "62px",
    height: "62px",
    marginBottom: "16px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
    color: "#1D4ED8",
    fontSize: "28px",
  },

  welcomeTitle: {
    margin: 0,
    color: "#0F172A",
    fontSize: "20px",
  },

  welcomeText: {
    maxWidth: "420px",
    margin: "10px 0 0",
    color: "#64748B",
    lineHeight: 1.6,
  },

  messageRow: {
    display: "flex",
    marginBottom: "16px",
  },

  userMessage: {
    maxWidth: "min(72%, 520px)",
    padding: "13px 15px",
    borderRadius: "16px 16px 6px 16px",
    background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
    color: "#FFFFFF",
    boxShadow: "0 12px 26px rgba(37, 99, 235, 0.2)",
    overflowWrap: "anywhere",
  },

  aiMessage: {
    maxWidth: "min(76%, 560px)",
    padding: "13px 15px",
    border: "1px solid #E2E8F0",
    borderRadius: "16px 16px 16px 6px",
    background: "#FFFFFF",
    color: "#334155",
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
    overflowWrap: "anywhere",
  },

  messageLabel: {
    marginBottom: "6px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.03em",
    opacity: 0.85,
    textTransform: "uppercase",
  },

  messageText: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.6,
    fontSize: "14px",
    overflowWrap: "anywhere",
  },

  typingText: {
    color: "#6B7280",
    fontStyle: "italic",
  },

  loadingState: {
    padding: "40px",
    color: "#64748B",
    textAlign: "center",
  },

  errorCard: {
    marginBottom: "16px",
    padding: "12px 14px",
    border: "1px solid #FCA5A5",
    borderRadius: "12px",
    background: "#FEF2F2",
    color: "#B91C1C",
  },

  inputArea: {
    display: "flex",
    alignItems: "flex-end",
    gap: "12px",
    padding: "16px 18px 10px",
    borderTop: "1px solid #E2E8F0",
    background: "#FFFFFF",
  },

  promptInput: {
    boxSizing: "border-box",
    width: "100%",
    maxWidth: "100%",
    minHeight: "50px",
    padding: "12px 14px",
    border: "1px solid #CBD5E1",
    borderRadius: "14px",
    resize: "none",
    fontFamily: "inherit",
    fontSize: "14px",
    color: "#0F172A",
    background: "#F8FAFC",
    outline: "none",
  },

  sendButton: {
    minWidth: "96px",
    height: "50px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
    color: "#FFFFFF",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(37, 99, 235, 0.24)",
  },

  inputHint: {
    margin: 0,
    padding: "0 18px 16px",
    color: "#94A3B8",
    fontSize: "12px",
  },
};

export default AICopilot;