import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import StatsCards from "./components/StatsCards";
import Datasets from "./components/Datasets";
import DataQuality from "./components/DataQuality";
import Pipelines from "./components/Pipelines";
import AICopilot from "./components/AICopilot";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

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
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main
        style={{
          flex: 1,
          background: "#f8fafc",
          padding: 32,
        }}
      >
        <Header />
        <SearchBar />

        {activePage === "Dashboard" && (
          <>
            <StatsCards stats={stats} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 20,
                marginTop: 28,
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: 24,
                  borderRadius: 16,
                }}
              >
                <h3>Pipeline Activity</h3>

                <div style={{ width: "100%", height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pipelineData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="runs"
                        fill="#2563eb"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div
                style={{
                  background: "white",
                  padding: 24,
                  borderRadius: 16,
                }}
              >
                <h3>AI Copilot</h3>
                <p>
                  Ask CortexOS questions about datasets,
                  pipeline failures, and quality issues.
                </p>
              </div>
            </div>
          </>
        )}

        {activePage === "Datasets" && <Datasets />}
        {activePage === "Pipelines" && <Pipelines />}
        {activePage === "Data Quality" && <DataQuality />}
        {activePage === "AI Copilot" && <AICopilot />}

        {activePage === "Alerts" && (
          <h2 style={{ marginTop: 30 }}>
            Alerts Page Coming Soon
          </h2>
        )}

        {activePage === "Users" && (
          <h2 style={{ marginTop: 30 }}>
            Users Page Coming Soon
          </h2>
        )}

        {activePage === "Settings" && (
          <h2 style={{ marginTop: 30 }}>
            Settings Page Coming Soon
          </h2>
        )}
      </main>
    </div>
  );
}

export default App;