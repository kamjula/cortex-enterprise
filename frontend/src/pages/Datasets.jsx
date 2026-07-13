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

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Dataset Management</h2>
      <p>Live PostgreSQL datasets connected to CortexOS.</p>

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            background: "#FEF2F2",
            color: "#991B1B",
            borderRadius: 8,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <input
          placeholder="Dataset Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          placeholder="Owner"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
        />

        <input
          type="number"
          placeholder="Records"
          value={records}
          onChange={(event) => setRecords(event.target.value)}
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="Healthy">Healthy</option>
          <option value="Warning">Warning</option>
          <option value="Failed">Failed</option>
        </select>

        <button type="button" onClick={saveDataset}>
          {editingId ? "Update Dataset" : "Add Dataset"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      <table
        style={{
          width: "100%",
          background: "white",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Name</th>
            <th style={th}>Owner</th>
            <th style={th}>Records</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {datasets.map((item) => (
            <tr key={item.id}>
              <td style={td}>{item.id}</td>
              <td style={td}>{item.name}</td>
              <td style={td}>{item.owner}</td>
              <td style={td}>
                {Number(item.records || 0).toLocaleString()}
              </td>
              <td style={td}>{item.status}</td>
              <td style={td}>
                <button
                  type="button"
                  onClick={() => editDataset(item)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => deleteDataset(item.id)}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  padding: 12,
  background: "#2563EB",
  color: "white",
  textAlign: "left",
};

const td = {
  padding: 12,
  borderBottom: "1px solid #E5E7EB",
};

export default Datasets;