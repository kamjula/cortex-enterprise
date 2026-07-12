import { useEffect, useState } from "react";

function StatusBadge({ status }) {
  const colors = {
    Success: {
      background: "#ecfdf3",
      color: "#047857",
      border: "#a7f3d0",
    },
    Running: {
      background: "#eff6ff",
      color: "#2563eb",
      border: "#bfdbfe",
    },
    Failed: {
      background: "#fef2f2",
      color: "#dc2626",
      border: "#fecaca",
    },
  };

  const style = colors[status] || colors.Running;

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

function Pipelines() {
  const [pipelines, setPipelines] = useState([]);
  const [search, setSearch] = useState("");

  const fetchPipelines = () => {
  fetch("http://localhost:5050/pipelines")
    .then((res) => res.json())
    .then((data) => {
      console.log("Pipelines Data:", data);
      setPipelines(data);
    })
    .catch((err) => console.error("Pipeline Fetch Error:", err));
};
  useEffect(() => {
    fetchPipelines();
  }, []);

  const filtered = pipelines.filter((item) => {
  const text = `${item.pipeline_name || ""} ${item.source || ""} ${item.destination || ""} ${item.status || ""}`.toLowerCase();
  return text.includes(search.toLowerCase());
});

  return (
    <div style={{ marginTop: 24, fontFamily: "Inter, sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Pipeline Monitoring</h2>
          <p style={{ color: "#64748b" }}>
            Live ETL and Data Pipeline Monitoring
          </p>
        </div>

        <button style={primaryButton}>+ Trigger Pipeline</button>
      </div>

      <div
        style={{
          background: "white",
          padding: 18,
          borderRadius: 16,
          marginBottom: 20,
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        }}
      >
        <input
          placeholder="Search pipelines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid #cbd5e1",
          }}
        />
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#2563eb" }}>
              <th style={th}>ID</th>
              <th style={th}>Pipeline</th>
              <th style={th}>Source</th>
              <th style={th}>Destination</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                style={{ borderBottom: "1px solid #e2e8f0" }}
              >
                <td style={td}>{item.id}</td>

                <td style={{ ...td, fontWeight: 700 }}>
                  {item.pipeline_name}
                </td>

                <td style={td}>{item.source}</td>

                <td style={td}>{item.destination}</td>

                <td style={td}>
                  <StatusBadge status={item.status} />
                </td>

                <td style={td}>
                  <button style={actionButton}>Logs</button>{" "}
                  <button style={actionButton}>Retry</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 15, color: "#64748b" }}>
        Showing {filtered.length} of {pipelines.length} pipelines
      </p>
    </div>
  );
}

const th = {
  padding: 14,
  color: "white",
  textAlign: "left",
};

const td = {
  padding: 14,
};

const primaryButton = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 10,
  padding: "10px 18px",
  cursor: "pointer",
  fontWeight: 600,
};

const actionButton = {
  border: "1px solid #dbeafe",
  background: "#eff6ff",
  color: "#2563eb",
  borderRadius: 8,
  padding: "6px 10px",
  cursor: "pointer",
  marginRight: 6,
};

export default Pipelines;