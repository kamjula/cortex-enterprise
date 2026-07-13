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
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPipelineId, setSelectedPipelineId] =
    useState("");
  const [selectedLogData, setSelectedLogData] =
    useState(null);
  const [logsLoading, setLogsLoading] = useState(false);

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
      const pipelineList = Array.isArray(data) ? data : [];

      setPipelines(pipelineList);

      if (
        pipelineList.length > 0 &&
        !selectedPipelineId
      ) {
        setSelectedPipelineId(
          String(pipelineList[0].id)
        );
      }
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

  const showTemporarySuccess = (message) => {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const triggerPipeline = async () => {
    if (!selectedPipelineId) {
      setError("Please select a pipeline.");
      return;
    }

    try {
      setActionLoading(
        `trigger-${selectedPipelineId}`
      );
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `http://localhost:5050/pipelines/${selectedPipelineId}/trigger`,
        {
          method: "PATCH",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to trigger pipeline"
        );
      }

      showTemporarySuccess(
        result.message ||
          "Pipeline triggered successfully."
      );

      await fetchPipelines();
    } catch (err) {
      console.error("Trigger Pipeline Error:", err);
      setError(
        err.message || "Could not trigger pipeline"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const retryPipeline = async (pipeline) => {
    try {
      setActionLoading(`retry-${pipeline.id}`);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `http://localhost:5050/pipelines/${pipeline.id}/retry`,
        {
          method: "PATCH",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to retry pipeline"
        );
      }

      showTemporarySuccess(
        `${pipeline.pipeline_name} retry started.`
      );

      await fetchPipelines();
    } catch (err) {
      console.error("Retry Pipeline Error:", err);
      setError(
        err.message || "Could not retry pipeline"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const viewLogs = async (pipeline) => {
    try {
      setLogsLoading(true);
      setError("");
      setSelectedLogData(null);

      const response = await fetch(
        `http://localhost:5050/pipelines/${pipeline.id}/logs`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to load logs"
        );
      }

      setSelectedLogData(result);
    } catch (err) {
      console.error("Pipeline Logs Error:", err);
      setError(
        err.message || "Could not load pipeline logs"
      );
    } finally {
      setLogsLoading(false);
    }
  };

  const closeLogs = () => {
    setSelectedLogData(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>
            Pipeline Monitoring
          </h2>

          <p style={styles.subtitle}>
            Live ETL and data pipeline monitoring.
          </p>
        </div>

        <div style={styles.triggerArea}>
          <label
            htmlFor="pipeline-trigger-select"
            style={styles.triggerLabel}
          >
            Select pipeline
          </label>

          <select
            id="pipeline-trigger-select"
            name="pipelineTrigger"
            value={selectedPipelineId}
            onChange={(event) =>
              setSelectedPipelineId(event.target.value)
            }
            style={styles.triggerSelect}
          >
            {pipelines.map((pipeline) => (
              <option
                key={pipeline.id}
                value={pipeline.id}
              >
                {pipeline.pipeline_name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={triggerPipeline}
            disabled={
              !selectedPipelineId ||
              actionLoading ===
                `trigger-${selectedPipelineId}`
            }
            style={{
              ...styles.primaryButton,
              opacity:
                !selectedPipelineId ||
                actionLoading ===
                  `trigger-${selectedPipelineId}`
                  ? 0.65
                  : 1,
            }}
          >
            {actionLoading ===
            `trigger-${selectedPipelineId}`
              ? "Triggering..."
              : "+ Trigger Pipeline"}
          </button>
        </div>
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

      {successMessage && (
        <div style={styles.successCard}>
          {successMessage}
        </div>
      )}

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
                  <th style={styles.th}>
                    Destination
                  </th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>
                    Last Run
                  </th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>
                      {item.id}
                    </td>

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
                      <StatusBadge
                        status={item.status}
                      />
                    </td>

                    <td style={styles.td}>
                      {item.last_run
                        ? new Date(
                            item.last_run
                          ).toLocaleString()
                        : "—"}
                    </td>

                    <td style={styles.td}>
                      <div
                        style={styles.actionButtons}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            viewLogs(item)
                          }
                          disabled={logsLoading}
                          style={styles.actionButton}
                        >
                          Logs
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            retryPipeline(item)
                          }
                          disabled={
                            actionLoading ===
                            `retry-${item.id}`
                          }
                          style={{
                            ...styles.retryButton,
                            opacity:
                              actionLoading ===
                              `retry-${item.id}`
                                ? 0.65
                                : 1,
                          }}
                        >
                          {actionLoading ===
                          `retry-${item.id}`
                            ? "Retrying..."
                            : "Retry"}
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

      {(logsLoading || selectedLogData) && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>
                  Pipeline Logs
                </h3>

                {selectedLogData && (
                  <p style={styles.modalSubtitle}>
                    {
                      selectedLogData.pipeline
                        .pipeline_name
                    }
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={closeLogs}
                style={styles.closeButton}
              >
                Close
              </button>
            </div>

            {logsLoading ? (
              <div style={styles.logsLoading}>
                Loading pipeline logs...
              </div>
            ) : (
              <div style={styles.logsContainer}>
                {selectedLogData?.logs?.map(
                  (log, index) => (
                    <div
                      key={`${log.timestamp}-${index}`}
                      style={styles.logRow}
                    >
                      <div style={styles.logTopRow}>
                        <span
                          style={getLogLevelStyle(
                            log.level
                          )}
                        >
                          {log.level}
                        </span>

                        <span
                          style={styles.logTimestamp}
                        >
                          {new Date(
                            log.timestamp
                          ).toLocaleString()}
                        </span>
                      </div>

                      <div style={styles.logMessage}>
                        {log.message}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getLogLevelStyle(level) {
  const base = {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 800,
  };

  if (level === "ERROR") {
    return {
      ...base,
      background: "#FEE2E2",
      color: "#991B1B",
    };
  }

  if (level === "SUCCESS") {
    return {
      ...base,
      background: "#DCFCE7",
      color: "#166534",
    };
  }

  return {
    ...base,
    background: "#DBEAFE",
    color: "#1D4ED8",
  };
}

const styles = {
  page: {
    marginTop: "24px",
    fontFamily: "Inter, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
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

  triggerArea: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    flexWrap: "wrap",
  },

  triggerLabel: {
    alignSelf: "center",
    color: "#374151",
    fontSize: "13px",
    fontWeight: 600,
  },

  triggerSelect: {
    minWidth: "190px",
    padding: "10px 12px",
    border: "1px solid #CBD5E1",
    borderRadius: "10px",
    background: "#FFFFFF",
    fontSize: "14px",
  },

  primaryButton: {
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    padding: "11px 18px",
    cursor: "pointer",
    fontWeight: 600,
  },

  searchCard: {
    marginBottom: "20px",
    padding: "18px",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    background: "#FFFFFF",
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.06)",
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

  successCard: {
    marginBottom: "16px",
    padding: "14px",
    border: "1px solid #BBF7D0",
    borderRadius: "10px",
    background: "#F0FDF4",
    color: "#166534",
    fontWeight: 600,
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

  tableCard: {
    overflow: "hidden",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    background: "#FFFFFF",
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.06)",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "1050px",
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
    fontWeight: 600,
  },

  retryButton: {
    border: "1px solid #EDE9FE",
    background: "#F5F3FF",
    color: "#6D28D9",
    borderRadius: "8px",
    padding: "6px 10px",
    cursor: "pointer",
    fontWeight: 600,
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

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    background: "rgba(15, 23, 42, 0.55)",
  },

  modal: {
    width: "min(720px, 100%)",
    maxHeight: "80vh",
    overflow: "hidden",
    borderRadius: "16px",
    background: "#FFFFFF",
    boxShadow:
      "0 24px 60px rgba(15, 23, 42, 0.25)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    padding: "18px 20px",
    borderBottom: "1px solid #E5E7EB",
  },

  modalTitle: {
    margin: 0,
    color: "#111827",
  },

  modalSubtitle: {
    margin: "5px 0 0",
    color: "#64748B",
    fontSize: "14px",
  },

  closeButton: {
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    padding: "8px 12px",
    background: "#FFFFFF",
    color: "#374151",
    cursor: "pointer",
    fontWeight: 600,
  },

  logsLoading: {
    padding: "40px",
    color: "#64748B",
    textAlign: "center",
  },

  logsContainer: {
    maxHeight: "60vh",
    overflowY: "auto",
    padding: "18px 20px",
    background: "#F8FAFC",
  },

  logRow: {
    marginBottom: "12px",
    padding: "14px",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    background: "#FFFFFF",
  },

  logTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "8px",
  },

  logTimestamp: {
    color: "#94A3B8",
    fontSize: "12px",
  },

  logMessage: {
    color: "#334155",
    lineHeight: 1.5,
  },
};

export default Pipelines;