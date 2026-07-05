function DataQuality() {
  const checks = [
    {
      name: "Customer Data",
      score: "99.8%",
      status: "Healthy",
    },
    {
      name: "Sales Orders",
      score: "96.5%",
      status: "Warning",
    },
    {
      name: "Inventory",
      score: "98.9%",
      status: "Healthy",
    },
    {
      name: "Finance",
      score: "92.4%",
      status: "Critical",
    },
  ];

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Data Quality Dashboard</h2>

      <table
        style={{
          width: "100%",
          marginTop: 20,
          borderCollapse: "collapse",
          background: "white",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: "#2563eb", color: "white" }}>
            <th style={{ padding: 15 }}>Dataset</th>
            <th>Quality Score</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {checks.map((item) => (
            <tr key={item.name}>
              <td style={{ padding: 15 }}>{item.name}</td>
              <td>{item.score}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataQuality;