function Pipelines() {
  const pipelines = [
    { name: "Customer Sync", status: "Running", lastRun: "5 mins ago", duration: "12m", owner: "Data Team" },
    { name: "Orders ETL", status: "Success", lastRun: "30 mins ago", duration: "8m", owner: "Analytics" },
    { name: "Inventory Load", status: "Failed", lastRun: "1 hour ago", duration: "3m", owner: "Ops" },
    { name: "Payments Validation", status: "Success", lastRun: "2 hours ago", duration: "15m", owner: "Finance" },
  ];

  const statusColor = (status) => {
    if (status === "Running") return "#2563eb";
    if (status === "Success") return "#16a34a";
    return "#dc2626";
  };

  return (
    <div style={{ background: "white", padding: 24, borderRadius: 16, marginTop: 30 }}>
      <h2>Pipeline Monitoring</h2>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
            <th style={{ textAlign: "left", padding: 12 }}>Pipeline</th>
            <th style={{ textAlign: "left", padding: 12 }}>Status</th>
            <th style={{ textAlign: "left", padding: 12 }}>Last Run</th>
            <th style={{ textAlign: "left", padding: 12 }}>Duration</th>
            <th style={{ textAlign: "left", padding: 12 }}>Owner</th>
            <th style={{ textAlign: "left", padding: 12 }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {pipelines.map((item) => (
            <tr key={item.name} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: 12 }}>{item.name}</td>
              <td style={{ padding: 12, color: statusColor(item.status), fontWeight: "bold" }}>
                {item.status}
              </td>
              <td style={{ padding: 12 }}>{item.lastRun}</td>
              <td style={{ padding: 12 }}>{item.duration}</td>
              <td style={{ padding: 12 }}>{item.owner}</td>
              <td style={{ padding: 12 }}>
                <button
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Pipelines;