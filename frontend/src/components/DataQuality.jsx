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
      display: "inline-block",
      minWidth: "72px",
      padding: "6px 12px",
      borderRadius: "999px",
      textAlign: "center",
      fontSize: "12px",
      fontWeight: 700,
    };

    if (status === "Healthy") {
      return {
        ...baseStyle,
        background: "#DCFCE7",
        color: "#166534",
      };
    }

    if (status === "Warning") {
      return {
        ...baseStyle,
        background: "#FEF3C7",
        color: "#92400E",
      };
    }

    return {
      ...baseStyle,
      background: "#FEE2E2",
      color: "#991B1B",
    };
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
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
        <input
          type="text"
          placeholder="Search by dataset or status..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={styles.searchInput}
        />
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
                      {Number(item.score || 0).toFixed(2)}%
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
  },

  title: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#6B7280",
    fontSize: "15px",
  },

  refreshButton: {
    border: "none",
    borderRadius: "10px",
    background: "#2563EB",
    color: "#FFFFFF",
    padding: "11px 20px",
    fontWeight: 600,
    cursor: "pointer",
  },

  toolbar: {
    marginBottom: "18px",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #D1D5DB",
    borderRadius: "10px",
    padding: "13px 16px",
    fontSize: "14px",
    outline: "none",
    background: "#FFFFFF",
  },

  tableCard: {
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
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
    background: "#2563EB",
    color: "#FFFFFF",
    padding: "15px 18px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 700,
  },

  td: {
    padding: "16px 18px",
    borderBottom: "1px solid #E5E7EB",
    color: "#4B5563",
    fontSize: "14px",
  },

  tdStrong: {
    padding: "16px 18px",
    borderBottom: "1px solid #E5E7EB",
    color: "#111827",
    fontSize: "14px",
    fontWeight: 600,
  },

  footer: {
    padding: "14px 18px",
    textAlign: "center",
    color: "#6B7280",
    fontSize: "13px",
    background: "#F9FAFB",
  },

  stateCard: {
    padding: "30px",
    border: "1px solid #E5E7EB",
    borderRadius: "14px",
    textAlign: "center",
    color: "#6B7280",
    background: "#FFFFFF",
  },

  errorCard: {
    padding: "24px",
    border: "1px solid #FECACA",
    borderRadius: "14px",
    textAlign: "center",
    background: "#FEF2F2",
  },

  errorText: {
    margin: 0,
    color: "#991B1B",
  },

  retryButton: {
    marginTop: "14px",
    border: "none",
    borderRadius: "8px",
    padding: "9px 16px",
    background: "#DC2626",
    color: "#FFFFFF",
    cursor: "pointer",
  },

  emptyState: {
    padding: "32px",
    textAlign: "center",
    color: "#6B7280",
  },
};

export default DataQuality;