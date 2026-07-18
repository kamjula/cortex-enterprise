import { useEffect, useMemo, useState } from "react";

function DataQuality() {
  const [checks, setChecks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadQualityChecks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5050/data-quality");

      if (!response.ok) {
        throw new Error("Failed to load data quality checks");
      }

      const data = await response.json();
      setChecks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Data Quality Fetch Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQualityChecks();
  }, []);

  const filteredChecks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return checks;
    }

    return checks.filter((item) => {
      const datasetName = String(item.dataset_name || "").toLowerCase();
      const status = String(item.status || "").toLowerCase();

      return datasetName.includes(query) || status.includes(query);
    });
  }, [checks, searchTerm]);

  const getStatusStyle = (status) => {
    const baseStyle = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "80px",
      padding: "6px 12px",
      borderRadius: "999px",
      textAlign: "center",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.01em",
    };

    if (status === "Healthy") {
      return {
        ...baseStyle,
        background: "rgba(22, 163, 74, 0.12)",
        color: "#166534",
      };
    }

    if (status === "Warning") {
      return {
        ...baseStyle,
        background: "rgba(245, 158, 11, 0.14)",
        color: "#92400E",
      };
    }

    return {
      ...baseStyle,
      background: "rgba(239, 68, 68, 0.12)",
      color: "#991B1B",
    };
  };

  const getScoreStyle = (score) => {
    const numericScore = Number(score || 0);
    let background = "rgba(79, 70, 229, 0.12)";
    let color = "#3730a3";

    if (numericScore >= 90) {
      background = "rgba(22, 163, 74, 0.14)";
      color = "#166534";
    } else if (numericScore >= 75) {
      background = "rgba(245, 158, 11, 0.16)";
      color = "#b45309";
    } else {
      background = "rgba(239, 68, 68, 0.13)";
      color = "#b91c1c";
    }

    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "82px",
      padding: "6px 12px",
      borderRadius: "999px",
      fontSize: "13px",
      fontWeight: 700,
      background,
      color,
    };
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerText}>
          <h2 style={styles.title}>Data Quality Dashboard</h2>
          <p style={styles.subtitle}>
            Monitor enterprise data quality in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={loadQualityChecks}
          style={{
            ...styles.refreshButton,
            opacity: loading ? 0.7 : 1,
          }}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.searchCard}>
          <input
            type="text"
            placeholder="Search by dataset or status..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {loading && (
        <div style={styles.stateCard}>
          Loading quality checks...
        </div>
      )}

      {!loading && error && (
        <div style={styles.errorCard}>
          <p style={styles.errorText}>{error}</p>

          <button
            type="button"
            onClick={loadQualityChecks}
            style={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div style={styles.tableCard}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Dataset</th>
                  <th style={styles.th}>Score</th>
                  <th style={styles.th}>Missing</th>
                  <th style={styles.th}>Duplicates</th>
                  <th style={styles.th}>Failed Rules</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredChecks.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.tdStrong}>
                      {item.dataset_name}
                    </td>

                    <td style={styles.td}>
                      <span style={getScoreStyle(item.score)}>
                        {Number(item.score || 0).toFixed(2)}%
                      </span>
                    </td>

                    <td style={styles.td}>
                      {item.missing_values}
                    </td>

                    <td style={styles.td}>
                      {item.duplicate_records}
                    </td>

                    <td style={styles.td}>
                      {item.failed_rules}
                    </td>

                    <td style={styles.td}>
                      <span style={getStatusStyle(item.status)}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredChecks.length === 0 ? (
            <div style={styles.emptyState}>
              No quality checks found.
            </div>
          ) : (
            <div style={styles.footer}>
              Showing {filteredChecks.length} of {checks.length} quality checks
            </div>
          )}
        </div>
      )}
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
    flexWrap: "wrap",
  },

  headerText: {
    minWidth: 0,
    flex: 1,
  },

  title: {
    margin: 0,
    fontSize: "clamp(1.5rem, 2.3vw, 1.9rem)",
    color: "#0f172a",
    letterSpacing: "-0.02em",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "15px",
  },

  refreshButton: {
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    color: "#FFFFFF",
    padding: "11px 18px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(37, 99, 235, 0.2)",
  },

  toolbar: {
    marginBottom: "18px",
  },

  searchCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "10px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "13px 16px",
    fontSize: "14px",
    outline: "none",
    background: "#ffffff",
    color: "#0f172a",
  },

  tableCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "760px",
    borderCollapse: "collapse",
  },

  th: {
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    color: "#ffffff",
    padding: "15px 18px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 700,
  },

  td: {
    padding: "16px 18px",
    borderBottom: "1px solid #e2e8f0",
    color: "#475569",
    fontSize: "14px",
    background: "#ffffff",
  },

  tdStrong: {
    padding: "16px 18px",
    borderBottom: "1px solid #e2e8f0",
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: 700,
    background: "#ffffff",
  },

  footer: {
    padding: "14px 18px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "13px",
    background: "#f8fafc",
  },

  stateCard: {
    padding: "30px",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    textAlign: "center",
    color: "#64748b",
    background: "#ffffff",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
  },

  errorCard: {
    padding: "24px",
    border: "1px solid #fecaca",
    borderRadius: "16px",
    textAlign: "center",
    background: "#fef2f2",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
  },

  errorText: {
    margin: 0,
    color: "#991b1b",
  },

  retryButton: {
    marginTop: "14px",
    border: "none",
    borderRadius: "10px",
    padding: "9px 16px",
    background: "#dc2626",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
  },

  emptyState: {
    padding: "32px",
    textAlign: "center",
    color: "#64748b",
    background: "#f8fafc",
  },
};

export default DataQuality;