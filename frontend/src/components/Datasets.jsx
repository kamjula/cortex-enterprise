import { useEffect, useState } from "react";

function Datasets() {
  const [datasets, setDatasets] = useState([]);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [records, setRecords] = useState("");
  const [status, setStatus] = useState("Healthy");
  const [editingId, setEditingId] = useState(null);

  const loadDatasets = async () => {
    const res = await fetch("http://localhost:5050/datasets");
    const data = await res.json();
    setDatasets(data);
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
    if (!name || !owner || !records) {
      alert("Please fill all fields");
      return;
    }

    const payload = { name, owner, records: Number(records), status };

    if (editingId) {
      await fetch(`http://localhost:5050/datasets/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("http://localhost:5050/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    loadDatasets();
  };

  const editDataset = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setOwner(item.owner);
    setRecords(item.records);
    setStatus(item.status);
  };

  const deleteDataset = async (id) => {
    if (!window.confirm("Delete this dataset?")) return;

    await fetch(`http://localhost:5050/datasets/${id}`, {
      method: "DELETE",
    });

    loadDatasets();
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Datasets</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input placeholder="Dataset Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
        <input placeholder="Records" value={records} onChange={(e) => setRecords(e.target.value)} />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Healthy</option>
          <option>Warning</option>
          <option>Failed</option>
        </select>

        <button onClick={saveDataset}>{editingId ? "Update" : "Add Dataset"}</button>
        {editingId && <button onClick={resetForm}>Cancel</button>}
      </div>

      <table style={{ width: "100%", background: "white", borderCollapse: "collapse" }}>
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
              <td style={td}>{item.records}</td>
              <td style={td}>{item.status}</td>
              <td style={td}>
                <button onClick={() => editDataset(item)}>Edit</button>
                <button onClick={() => deleteDataset(item.id)}>Delete</button>
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
  background: "#2563eb",
  color: "white",
};

const td = {
  padding: 12,
  borderBottom: "1px solid #ddd",
};

export default Datasets;