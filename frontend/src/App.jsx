import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const stats = [
    { title: "Total Datasets", value: "1,248", change: "+12.5%" },
    { title: "Active Pipelines", value: "320", change: "+8.2%" },
    { title: "Data Quality", value: "98.6%", change: "+2.4%" },
    { title: "Alerts", value: "3", change: "-1 today" },
  ];

  const pipelineData = [
    { day: "Mon", runs: 120 },
    { day: "Tue", runs: 180 },
    { day: "Wed", runs: 150 },
    { day: "Thu", runs: 220 },
    { day: "Fri", runs: 300 },
    { day: "Sat", runs: 260 },
    { day: "Sun", runs: 190 },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>
      <Sidebar activePage="Dashboard" onNavigate={(page) => console.log(page)} />

      <main style={{ flex: 1, background: "#f8fafc", padding: 32 }}>
        <Header />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            marginTop: 30,
          }}
        >
          {stats.map((item) => (
            <div
              key={item.title}
              style={{ background: "white", padding: 24, borderRadius: 16 }}
            >
              <p style={{ color: "#64748b" }}>{item.title}</p>
              <h2 style={{ color: "#111827" }}>{item.value}</h2>
              <p style={{ color: "#16a34a" }}>{item.change}</p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
            marginTop: 28,
          }}
        >
          <div style={{ background: "white", padding: 24, borderRadius: 16 }}>
            <h3 style={{ color: "#111827" }}>Pipeline Activity</h3>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={pipelineData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="runs" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: "white", padding: 24, borderRadius: 16 }}>
            <h3 style={{ color: "#111827" }}>AI Copilot</h3>
            <p style={{ color: "#64748b" }}>
              Ask CortexOS questions about datasets, pipeline failures, and
              quality issues.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;