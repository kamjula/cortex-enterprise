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

      const res = await fetch("http://localhost:5050/data-quality");

      if (!res.ok) {
        throw new Error("Failed to load data quality checks");
      }

      const data = await res.json();
      setChecks(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQualityChecks();
  }, []);

  const filteredChecks = useMemo(() => {
    return checks.filter((item) =>
      item.dataset_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [checks, searchTerm]);

  const getStatusStyle = (status) => {
    const base = {
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 600,
    };

    if (status === "Healthy") {
      return {
        ...base,
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "Warning") {
      return {
        ...base,
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    return {
      ...base,
      background: "#fee2e2",
      color: "#991b1b",
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
          style={styles.refreshButton}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search dataset..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {loading && (
        <div style={styles.stateCard}>Loading quality checks...</div>
      )}

      {!loading && error && (
        <div style={styles.errorCard}>
          <p style={{ margin: 0 }}>{error}</p>
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
                    <td style={styles.tdStrong}>{item.dataset_name}</td>
                    <td style={styles.td}>{Number(item.score).toFixed(2)}%</td>
                    <td style={styles.td}>{item.missing_values}</td>
                    <td style={styles.td}>{item.duplicate_records}</td>
                    <td style={styles.td}>{item.failed_rules}</td>
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
              No quality checks found for “{searchTerm}”.
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
    color: "#6b7280",
    fontSize: "15px",
  },
  refreshButton: {
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
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
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    padding: "13px 16px",
    fontSize: "14px",
    outline: "none",
    background: "#ffffff",
  },
  tableCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "760px",
  },
  th: {
    background: "#2563eb",
    color: "#ffffff",
    padding: "15px 18px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 700,
  },
  td: {
    padding: "16px 18px",
    borderBottom: "1px solid #e5e7eb",
    color: "#4b5563",
    fontSize: "14px",
  },
  tdStrong: {
    padding: "16px 18px",
    borderBottom: "1px solid #e5e7eb",
    color: "#111827",
    fontSize: "14px",
    fontWeight: 600,
  },
  footer: {
    padding: "14px 18px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "13px",
    background: "#f9fafb",
  },
  stateCard: {
    padding: "30px",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    textAlign: "center",
    color: "#6b7280",
    background: "#ffffff",
  },
  errorCard: {
    padding: "24px",
    border: "1px solid #fecaca",
    borderRadius: "14px",
    textAlign: "center",
    color: "#991b1b",
    background: "#fef2f2",
  },
  retryButton: {
    marginTop: "14px",
    border: "none",
    borderRadius: "8px",
    padding: "9px 16px",
    background: "#dc2626",
    color: "#ffffff",
    cursor: "pointer",
  },
  emptyState: {
    padding: "32px",
    textAlign: "center",
    color: "#6b7280",
  },
};

export default DataQuality;