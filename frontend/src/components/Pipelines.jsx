import { useEffect, useMemo, useState } from "react";

function StatusBadge({ status }) {
  const colors = {
    Success: {
      background: "#ECFDF3",
      color: "#047857",
      border: "#A7F3D0",
    },
    Running: {
      background: "#EFF6FF",
      color: "#2563EB",
      border: "#BFDBFE",
    },
    Failed: {
      background: "#FEF2F2",
      color: "#DC2626",
      border: "#FECACA",
    },
  };

  const style = colors[status] || colors.Running;

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        background: style.background,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}
    >
      {status}
    </span>
  );
}

function Pipelines() {
  const [pipelines, setPipelines] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPipelines = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5050/pipelines"
      );

      if (!response.ok) {
        throw new Error("Failed to load pipelines");
      }

      const data = await response.json();
      setPipelines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Pipeline Fetch Error:", err);
      setError(err.message || "Could not load pipelines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return pipelines;
    }

    return pipelines.filter((item) => {
      const text = `
        ${item.pipeline_name || ""}
        ${item.source || ""}
        ${item.destination || ""}
        ${item.status || ""}
      `.toLowerCase();

      return text.includes(query);
    });
  }, [pipelines, search]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Pipeline Monitoring</h2>

          <p style={styles.subtitle}>
            Live ETL and data pipeline monitoring.
          </p>
        </div>

        <button
          type="button"
          style={styles.primaryButton}
        >
          + Trigger Pipeline
        </button>
      </div>

      <div style={styles.searchCard}>
        <label
          htmlFor="pipeline-search"
          style={styles.searchLabel}
        >
          Search pipelines
        </label>

        <input
          id="pipeline-search"
          name="pipelineSearch"
          type="search"
          placeholder="Search pipelines..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          style={styles.searchInput}
        />
      </div>

      {error && (
        <div style={styles.errorCard}>{error}</div>
      )}

      {loading ? (
        <div style={styles.stateCard}>
          Loading pipelines...
        </div>
      ) : (
        <div style={styles.tableCard}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Pipeline</th>
                  <th style={styles.th}>Source</th>
                  <th style={styles.th}>Destination</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.id}</td>

                    <td style={styles.tdStrong}>
                      {item.pipeline_name}
                    </td>

                    <td style={styles.td}>
                      {item.source}
                    </td>

                    <td style={styles.td}>
                      {item.destination}
                    </td>

                    <td style={styles.td}>
                      <StatusBadge status={item.status} />
                    </td>

                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button
                          type="button"
                          style={styles.actionButton}
                        >
                          Logs
                        </button>

                        <button
                          type="button"
                          style={styles.actionButton}
                        >
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 ? (
            <div style={styles.emptyState}>
              No pipelines found.
            </div>
          ) : (
            <div style={styles.footer}>
              Showing {filtered.length} of{" "}
              {pipelines.length} pipelines
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    marginTop: "24px",
    fontFamily: "Inter, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    color: "#111827",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748B",
  },

  primaryButton: {
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: 600,
  },

  searchCard: {
    marginBottom: "20px",
    padding: "18px",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    background: "#FFFFFF",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
  },

  searchLabel: {
    display: "block",
    marginBottom: "8px",
    color: "#374151",
    fontSize: "14px",
    fontWeight: 600,
  },

  searchInput: {
    boxSizing: "border-box",
    width: "100%",
    padding: "12px",
    border: "1px solid #CBD5E1",
    borderRadius: "10px",
    fontSize: "14px",
  },

  tableCard: {
    overflow: "hidden",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    background: "#FFFFFF",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "850px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "14px",
    background: "#2563EB",
    color: "#FFFFFF",
    textAlign: "left",
    fontSize: "13px",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #E2E8F0",
    color: "#4B5563",
    fontSize: "14px",
  },

  tdStrong: {
    padding: "14px",
    borderBottom: "1px solid #E2E8F0",
    color: "#111827",
    fontSize: "14px",
    fontWeight: 700,
  },

  actionButtons: {
    display: "flex",
    gap: "8px",
  },

  actionButton: {
    border: "1px solid #DBEAFE",
    background: "#EFF6FF",
    color: "#2563EB",
    borderRadius: "8px",
    padding: "6px 10px",
    cursor: "pointer",
  },

  errorCard: {
    marginBottom: "16px",
    padding: "14px",
    border: "1px solid #FECACA",
    borderRadius: "10px",
    background: "#FEF2F2",
    color: "#991B1B",
  },

  stateCard: {
    padding: "30px",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    background: "#FFFFFF",
    color: "#64748B",
    textAlign: "center",
  },

  emptyState: {
    padding: "30px",
    color: "#64748B",
    textAlign: "center",
  },

  footer: {
    padding: "14px 18px",
    background: "#F8FAFC",
    color: "#64748B",
    textAlign: "center",
    fontSize: "13px",
  },
};

export default Pipelines;