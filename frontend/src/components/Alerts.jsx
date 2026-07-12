import { useEffect, useState } from "react";

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const res = await fetch("http://localhost:5050/alerts");
    const data = await res.json();
    setAlerts(data);
  };

  const getColor = (severity) => {
    if (severity === "High") return "red";
    if (severity === "Medium") return "orange";
    return "green";
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Alerts</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
        }}
      >
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Title</th>
            <th style={th}>Severity</th>
            <th style={th}>Message</th>
            <th style={th}>Status</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map((item) => (
            <tr key={item.id}>
              <td style={td}>{item.id}</td>
              <td style={td}>{item.title}</td>

              <td style={{ ...td, color: getColor(item.severity), fontWeight: "bold" }}>
                {item.severity}
              </td>

              <td style={td}>{item.message}</td>
              <td style={td}>{item.status}</td>
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

export default Alerts;