import { useEffect, useState } from "react";

function StatusBadge({ status }) {
  const palette = {
    Healthy: { background: "#ecfdf3", color: "#047857", border: "#a7f3d0" },
    Warning: { background: "#fffbeb", color: "#b45309", border: "#fde68a" },
    Failed: { background: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  };

  const style = palette[status] || palette.Healthy;

  return (
    <span style={{
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      background: style.background,
      color: style.color,
      border: `1px solid ${style.border}`,
    }}>
      {status}
    </span>
  );
}

function MetricCard({ label, value, detail }) {
  return (
    <div style={{
      background: "white",
      borderRadius: 16,
      padding: 20,
      boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
      border: "1px solid #e2e8f0",
    }}>
      <div style={{ color: "#64748b", fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a" }}>{value}</div>
      <div style={{ color: "#94a3b8", fontSize: 12 }}>{detail}</div>
    </div>
  );
}

function Datasets() {
  const [datasets, setDatasets] = useState([]);
  const [search, setSearch] = useState("");

  const fetchDatasets = () => {
    fetch("http://localhost:5050/datasets")
      .then((res) => res.json())
      .then((data) => setDatasets(data))
      .catch((err) => console.error("Datasets Fetch Error:", err));
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const filtered = datasets.filter((item) => {
  const text = `${item.name} ${item.owner} ${item.status}`.toLowerCase();
  return text.includes(search.toLowerCase());
});

  const healthy = datasets.filter((d) => d.status === "Healthy").length;
  const warning = datasets.filter((d) => d.status === "Warning").length;
  const failed = datasets.filter((d) => d.status === "Failed").length;

  return (
    <div style={{ marginTop: 24, fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Dataset Management</h2>
          <p style={{ margin: "6px 0 0", color: "#64748b" }}>
            Live PostgreSQL datasets connected to CortexOS.
          </p>
        </div>

        <button style={primaryButton}>+ Add Dataset</button>
      </div>

      <div style={{
        background: "white",
        borderRadius: 16,
        padding: 18,
        marginBottom: 20,
        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        border: "1px solid #e2e8f0",
        display: "flex",
        gap: 12,
      }}>
        <input
          placeholder="Search datasets"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
          }}
        />
        <button onClick={fetchDatasets} style={secondaryButton}>Refresh</button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 16,
        marginBottom: 20,
      }}>
        <MetricCard label="Total Datasets" value={datasets.length} detail="From PostgreSQL" />
        <MetricCard label="Healthy" value={healthy} detail="Operational" />
        <MetricCard label="Warning" value={warning} detail="Needs review" />
        <MetricCard label="Failed" value={failed} detail="Requires action" />
      </div>

      <div style={{
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        border: "1px solid #e2e8f0",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["ID", "Dataset Name", "Owner", "Records", "Status", "Actions"].map((header) => (
                <th key={header} style={thStyle}>{header}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                <td style={tdStyle}>{item.id}</td>
                <td style={{ ...tdStyle, fontWeight: 700 }}>{item.name}</td>
                <td style={tdStyle}>{item.owner}</td>
                <td style={tdStyle}>{Number(item.records).toLocaleString()}</td>
                <td style={tdStyle}><StatusBadge status={item.status} /></td>
                <td style={tdStyle}>
                  <button style={actionButton}>View</button>{" "}
                  <button style={actionButton}>Edit</button>{" "}
                  <button style={{ ...actionButton, color: "#dc2626" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 16, color: "#64748b" }}>
        Showing {filtered.length} of {datasets.length} datasets
      </p>
    </div>
  );
}

const thStyle = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 700,
  color: "#475569",
  textTransform: "uppercase",
};

const tdStyle = {
  padding: "14px 16px",
  color: "#334155",
};

const primaryButton = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 10,
  padding: "10px 16px",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryButton = {
  background: "#f8fafc",
  color: "#334155",
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  padding: "10px 14px",
  fontWeight: 600,
  cursor: "pointer",
};

const actionButton = {
  border: "1px solid #dbeafe",
  background: "#f8fbff",
  color: "#2563eb",
  borderRadius: 8,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

export default Datasets;