import { useEffect, useMemo, useState } from "react";

const initialForm = {
  title: "",
  severity: "Medium",
  message: "",
  status: "Open",
};

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5050/alerts");

      if (!response.ok) {
        throw new Error("Failed to load alerts");
      }

      const data = await response.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Alerts fetch error:", err);
      setError(err.message || "Could not load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const filteredAlerts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return alerts;
    }

    return alerts.filter((item) => {
      return (
        String(item.title || "").toLowerCase().includes(query) ||
        String(item.message || "").toLowerCase().includes(query) ||
        String(item.severity || "").toLowerCase().includes(query) ||
        String(item.status || "").toLowerCase().includes(query)
      );
    });
  }, [alerts, searchTerm]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const saveAlert = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      alert("Please enter the alert title and message.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = editingId
        ? `http://localhost:5050/alerts/${editingId}`
        : "http://localhost:5050/alerts";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save alert");
      }

      resetForm();
      await loadAlerts();
    } catch (err) {
      console.error("Save alert error:", err);
      setError(err.message || "Could not save alert");
    } finally {
      setSaving(false);
    }
  };

  const editAlert = (item) => {
    setEditingId(item.id);

    setForm({
      title: item.title,
      severity: item.severity,
      message: item.message,
      status: item.status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resolveAlert = async (id) => {
    try {
      setError("");

      const response = await fetch(
        `http://localhost:5050/alerts/${id}/resolve`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resolve alert");
      }

      await loadAlerts();
    } catch (err) {
      console.error("Resolve alert error:", err);
      setError(err.message || "Could not resolve alert");
    }
  };

  const deleteAlert = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this alert?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `http://localhost:5050/alerts/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete alert");
      }

      if (editingId === id) {
        resetForm();
      }

      await loadAlerts();
    } catch (err) {
      console.error("Delete alert error:", err);
      setError(err.message || "Could not delete alert");
    }
  };

  const getSeverityStyle = (severity) => {
    const base = {
      display: "inline-block",
      minWidth: "68px",
      padding: "6px 10px",
      borderRadius: "999px",
      textAlign: "center",
      fontSize: "12px",
      fontWeight: 700,
    };

    if (severity === "Critical") {
      return {
        ...base,
        background: "#FECACA",
        color: "#7F1D1D",
      };
    }

    if (severity === "High") {
      return {
        ...base,
        background: "#FEE2E2",
        color: "#991B1B",
      };
    }

    if (severity === "Medium") {
      return {
        ...base,
        background: "#FEF3C7",
        color: "#92400E",
      };
    }

    return {
      ...base,
      background: "#DCFCE7",
      color: "#166534",
    };
  };

  const getStatusStyle = (status) => {
    const base = {
      display: "inline-block",
      minWidth: "82px",
      padding: "6px 10px",
      borderRadius: "999px",
      textAlign: "center",
      fontSize: "12px",
      fontWeight: 700,
    };

    if (status === "Resolved") {
      return {
        ...base,
        background: "#DCFCE7",
        color: "#166534",
      };
    }

    if (status === "Monitoring") {
      return {
        ...base,
        background: "#EDE9FE",
        color: "#6D28D9",
      };
    }

    return {
      ...base,
      background: "#DBEAFE",
      color: "#1D4ED8",
    };
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Alerts Center</h2>
          <p style={styles.subtitle}>
            Monitor, manage, and resolve platform alerts.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAlerts}
          style={styles.refreshButton}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div style={styles.formCard}>
        <h3 style={styles.formTitle}>
          {editingId ? "Edit Alert" : "Create Alert"}
        </h3>

        <div style={styles.formGrid}>
          <input
            name="title"
            placeholder="Alert title"
            value={form.title}
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="severity"
            value={form.severity}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="Open">Open</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <textarea
          name="message"
          placeholder="Alert message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          style={styles.textarea}
        />

        <div style={styles.formActions}>
          <button
            type="button"
            onClick={saveAlert}
            style={styles.primaryButton}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Alert"
                : "Add Alert"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={styles.secondaryButton}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div style={styles.toolbar}>
        <input
          placeholder="Search alerts..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={styles.searchInput}
        />
      </div>

      {error && <div style={styles.errorCard}>{error}</div>}

      {loading ? (
        <div style={styles.stateCard}>Loading alerts...</div>
      ) : (
        <div style={styles.tableCard}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Severity</th>
                  <th style={styles.th}>Message</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Created</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAlerts.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.tdStrong}>{item.title}</td>

                    <td style={styles.td}>
                      <span style={getSeverityStyle(item.severity)}>
                        {item.severity}
                      </span>
                    </td>

                    <td style={styles.td}>{item.message}</td>

                    <td style={styles.td}>
                      <span style={getStatusStyle(item.status)}>
                        {item.status}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "—"}
                    </td>

                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button
                          type="button"
                          onClick={() => editAlert(item)}
                          style={styles.editButton}
                        >
                          Edit
                        </button>

                        {item.status !== "Resolved" && (
                          <button
                            type="button"
                            onClick={() => resolveAlert(item.id)}
                            style={styles.resolveButton}
                          >
                            Resolve
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteAlert(item.id)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAlerts.length === 0 ? (
            <div style={styles.emptyState}>No alerts found.</div>
          ) : (
            <div style={styles.footer}>
              Showing {filteredAlerts.length} of {alerts.length} alerts
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
    color: "#111827",
    fontSize: "30px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#6B7280",
  },

  refreshButton: {
    border: "none",
    borderRadius: "10px",
    padding: "11px 18px",
    background: "#2563EB",
    color: "#FFFFFF",
    fontWeight: 600,
    cursor: "pointer",
  },

  formCard: {
    marginBottom: "20px",
    padding: "22px",
    border: "1px solid #E5E7EB",
    borderRadius: "14px",
    background: "#FFFFFF",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
  },

  formTitle: {
    margin: "0 0 16px",
    color: "#111827",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: "12px",
  },

  input: {
    boxSizing: "border-box",
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #D1D5DB",
    borderRadius: "9px",
    background: "#FFFFFF",
    fontSize: "14px",
  },

  textarea: {
    boxSizing: "border-box",
    width: "100%",
    marginTop: "12px",
    padding: "12px 14px",
    border: "1px solid #D1D5DB",
    borderRadius: "9px",
    resize: "vertical",
    fontFamily: "inherit",
    fontSize: "14px",
  },

  formActions: {
    display: "flex",
    gap: "10px",
    marginTop: "14px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "9px",
    padding: "10px 16px",
    background: "#2563EB",
    color: "#FFFFFF",
    fontWeight: 600,
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid #D1D5DB",
    borderRadius: "9px",
    padding: "10px 16px",
    background: "#FFFFFF",
    color: "#374151",
    fontWeight: 600,
    cursor: "pointer",
  },

  toolbar: {
    marginBottom: "16px",
  },

  searchInput: {
    boxSizing: "border-box",
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #D1D5DB",
    borderRadius: "10px",
    background: "#FFFFFF",
    fontSize: "14px",
  },

  tableCard: {
    overflow: "hidden",
    border: "1px solid #E5E7EB",
    borderRadius: "14px",
    background: "#FFFFFF",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "1000px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "14px 16px",
    background: "#2563EB",
    color: "#FFFFFF",
    textAlign: "left",
    fontSize: "13px",
  },

  td: {
    padding: "15px 16px",
    borderBottom: "1px solid #E5E7EB",
    color: "#4B5563",
    fontSize: "14px",
    verticalAlign: "top",
  },

  tdStrong: {
    padding: "15px 16px",
    borderBottom: "1px solid #E5E7EB",
    color: "#111827",
    fontSize: "14px",
    fontWeight: 600,
    verticalAlign: "top",
  },

  actionButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
  },

  editButton: {
    border: "none",
    borderRadius: "7px",
    padding: "7px 10px",
    background: "#DBEAFE",
    color: "#1D4ED8",
    fontWeight: 600,
    cursor: "pointer",
  },

  resolveButton: {
    border: "none",
    borderRadius: "7px",
    padding: "7px 10px",
    background: "#DCFCE7",
    color: "#166534",
    fontWeight: 600,
    cursor: "pointer",
  },

  deleteButton: {
    border: "none",
    borderRadius: "7px",
    padding: "7px 10px",
    background: "#FEE2E2",
    color: "#991B1B",
    fontWeight: 600,
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
    border: "1px solid #E5E7EB",
    borderRadius: "14px",
    background: "#FFFFFF",
    color: "#6B7280",
    textAlign: "center",
  },

  emptyState: {
    padding: "30px",
    color: "#6B7280",
    textAlign: "center",
  },

  footer: {
    padding: "14px 18px",
    background: "#F9FAFB",
    color: "#6B7280",
    textAlign: "center",
    fontSize: "13px",
  },
};

export default Alerts;