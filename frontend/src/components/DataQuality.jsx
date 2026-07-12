import { useEffect, useState } from "react";

function StatusBadge({ status }) {
  const colors = {
    Healthy: {
      background: "#ecfdf3",
      color: "#047857",
      border: "#a7f3d0",
    },
    Warning: {
      background: "#fffbeb",
      color: "#b45309",
      border: "#fde68a",
    },
    Critical: {
      background: "#fef2f2",
      color: "#dc2626",
      border: "#fecaca",
    },
  };

  const style = colors[status] || colors.Warning;

  return (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
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

function DataQuality() {
  const [quality, setQuality] = useState([]);
  const [search, setSearch] = useState("");

  const fetchQuality = () => {
    fetch("http://localhost:5050/quality")
      .then((res) => res.json())
      .then((data) => setQuality(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchQuality();
  }, []);

  const filtered = quality.filter((item) => {
    const text =
      `${item.dataset_name} ${item.status}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h2>Data Quality Dashboard</h2>
          <p style={{ color: "#64748b" }}>
            Monitor enterprise data quality in real time.
          </p>
        </div>

        <button
          onClick={fetchQuality}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      <input
        placeholder="Search dataset..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          border: "1px solid #ddd",
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: "#2563eb", color: "white" }}>
            <th style={th}>Dataset</th>
            <th style={th}>Score</th>
            <th style={th}>Missing</th>
            <th style={th}>Duplicates</th>
            <th style={th}>Failed Rules</th>
            <th style={th}>Status</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td style={td}>{item.dataset_name}</td>
              <td style={td}>{item.quality_score}%</td>
              <td style={td}>{item.missing_values}</td>
              <td style={td}>{item.duplicate_records}</td>
              <td style={td}>{item.failed_rules}</td>
              <td style={td}>
                <StatusBadge status={item.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: 15, color: "#64748b" }}>
        Showing {filtered.length} of {quality.length} quality checks
      </p>
    </div>
  );
}

const th = {
  padding: 14,
  textAlign: "left",
};

const td = {
  padding: 14,
  borderBottom: "1px solid #e2e8f0",
};

export default DataQuality;