import { useEffect, useState } from "react";

function Datasets() {
  const [datasets, setDatasets] = useState([]);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [records, setRecords] = useState("");
  const [status, setStatus] = useState("Healthy");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadDatasets = async () => {
    try {
      setError("");

      const response = await fetch("http://localhost:5050/datasets");

      if (!response.ok) {
        throw new Error("Failed to load datasets");
      }

      const data = await response.json();
      setDatasets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Dataset fetch error:", err);
      setError(err.message || "Could not load datasets");
    }
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  const resetForm = () => {
    setName("");
    setOwner("");
    setRecords("");
    setStatus("Healthy");
    setEditingId(null);
  };

  const saveDataset = async () => {
    if (!name.trim() || !owner.trim() || !records) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      name: name.trim(),
      owner: owner.trim(),
      records: Number(records),
      status,
    };

    try {
      setError("");

      const response = await fetch(
        editingId
          ? `http://localhost:5050/datasets/${editingId}`
          : "http://localhost:5050/datasets",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save dataset");
      }

      resetForm();
      await loadDatasets();
    } catch (err) {
      console.error("Save dataset error:", err);
      setError(err.message || "Could not save dataset");
    }
  };

  const editDataset = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setOwner(item.owner);
    setRecords(String(item.records));
    setStatus(item.status);
  };

  const deleteDataset = async (id) => {
    if (!window.confirm("Delete this dataset?")) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `http://localhost:5050/datasets/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete dataset");
      }

      await loadDatasets();
    } catch (err) {
      console.error("Delete dataset error:", err);
      setError(err.message || "Could not delete dataset");
    }
  };

  const getStatusBadgeStyle = (statusValue) => {
    if (statusValue === "Healthy") {
      return {
        background: "#DCFCE7",
        color: "#166534",
        border: "1px solid #86EFAC",
      };
    }

    if (statusValue === "Warning") {
      return {
        background: "#FEF3C7",
        color: "#B45309",
        border: "1px solid #FCD34D",
      };
    }

    return {
      background: "#FEE2E2",
      color: "#B91C1C",
      border: "1px solid #FCA5A5",
    };
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Dataset Management</h2>
          <p style={styles.subtitle}>
            Live PostgreSQL datasets connected to CortexOS.
          </p>
        </div>
      </div>

      {error && <div style={styles.errorCard}>{error}</div>}

      <div style={styles.formCard}>
        <div style={styles.formGrid}>
          <input
            placeholder="Dataset Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Owner"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            style={styles.input}
          />

          <input
            type="number"
            placeholder="Records"
            value={records}
            onChange={(event) => setRecords(event.target.value)}
            style={styles.input}
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            style={styles.input}
          >
            <option value="Healthy">Healthy</option>
            <option value="Warning">Warning</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div style={styles.formActions}>
          <button type="button" onClick={saveDataset} style={styles.primaryButton}>
            {editingId ? "Update Dataset" : "Add Dataset"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm} style={styles.secondaryButton}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Owner</th>
                <th style={styles.th}>Records</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {datasets.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>{item.id}</td>
                  <td style={{ ...styles.td, fontWeight: 700, color: "#0F172A" }}>
                    {item.name}
                  </td>
                  <td style={styles.td}>{item.owner}</td>
                  <td style={styles.td}>
                    {Number(item.records || 0).toLocaleString()}
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, ...getStatusBadgeStyle(item.status) }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionGroup}>
                      <button
                        type="button"
                        onClick={() => editDataset(item)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteDataset(item.id)}
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
      </div>
    </div>
  );
}

const styles = {
  page: {
    marginTop: "30px",
  },

  header: {
    marginBottom: "18px",
  },

  title: {
    margin: 0,
    color: "#0F172A",
    fontSize: "1.9rem",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748B",
    fontSize: "0.95rem",
  },

  errorCard: {
    marginBottom: "18px",
    padding: "12px 14px",
    background: "#FEF2F2",
    color: "#991B1B",
    borderRadius: "12px",
    border: "1px solid #FCA5A5",
    fontWeight: 600,
  },

  formCard: {
    background: "#FFFFFF",
    borderRadius: "18px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
    padding: "20px",
    marginBottom: "20px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },

  input: {
    boxSizing: "border-box",
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #CBD5E1",
    borderRadius: "12px",
    background: "#F8FAFC",
    color: "#0F172A",
    fontSize: "0.94rem",
    outline: "none",
  },

  formActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "14px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)",
    color: "#FFFFFF",
    padding: "11px 18px",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.22)",
  },

  secondaryButton: {
    border: "1px solid #CBD5E1",
    borderRadius: "12px",
    background: "#FFFFFF",
    color: "#0F172A",
    padding: "11px 18px",
    cursor: "pointer",
    fontWeight: 700,
  },

  tableCard: {
    background: "#FFFFFF",
    borderRadius: "18px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
    overflow: "hidden",
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
    padding: "14px 16px",
    background: "#2563EB",
    color: "#FFFFFF",
    textAlign: "left",
    fontSize: "0.82rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },

  td: {
    padding: "14px 16px",
    borderBottom: "1px solid #E2E8F0",
    color: "#475569",
    fontSize: "0.94rem",
    verticalAlign: "top",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "0.76rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.02em",
  },

  actionGroup: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  editButton: {
    border: "1px solid #BFDBFE",
    borderRadius: "10px",
    background: "#EFF6FF",
    color: "#1D4ED8",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },

  deleteButton: {
    border: "1px solid #FCA5A5",
    borderRadius: "10px",
    background: "#FEF2F2",
    color: "#B91C1C",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
};

export default Datasets;