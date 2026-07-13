import { useEffect, useState } from "react";
import Users from "./components/Users";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import StatsCards from "./components/StatsCards";
import Settings from "./components/Settings";

import Datasets from "./pages/Datasets";
import Pipelines from "./components/Pipelines";
import DataQuality from "./components/DataQuality";
import AICopilot from "./components/AICopilot";
import Alerts from "./components/Alerts";

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
  const [dashboard, setDashboard] = useState(null);
  const [dashboardError, setDashboardError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5050/dashboard")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Dashboard request failed: ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        setDashboard(data);
        setDashboardError("");
      })
      .catch((err) => {
        console.error("Dashboard Fetch Error:", err);
        setDashboardError("Could not load dashboard data.");
      });
  }, []);

  const stats = [
    {
      title: "Total Datasets",
      value: dashboard ? dashboard.totalDatasets : "...",
      change: "Live",
    },
    {
      title: "Healthy",
      value: dashboard ? dashboard.healthy : "...",
      change: "Database",
    },
    {
      title: "Warning",
      value: dashboard ? dashboard.warning : "...",
      change: "Needs Review",
    },
    {
      title: "Total Records",
      value: dashboard
        ? Number(dashboard.totalRecords || 0).toLocaleString()
        : "...",
      change: "Live",
    },
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
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main
        style={{
          flex: 1,
          padding: "30px",
          overflowY: "auto",
        }}
      >
        <Header />

        {activePage === "Datasets" && <SearchBar />}

        {activePage === "Dashboard" && (
          <>
            {dashboardError && (
              <p
                style={{
                  color: "#DC2626",
                  background: "#FEF2F2",
                  padding: "12px",
                  borderRadius: "10px",
                  marginTop: "20px",
                }}
              >
                {dashboardError}
              </p>
            )}

            <StatsCards stats={stats} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(0, 2fr) minmax(280px, 1fr)",
                gap: "20px",
                marginTop: "30px",
              }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow:
                    "0 10px 30px rgba(15,23,42,0.06)",
                  border: "1px solid #E2E8F0",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "20px",
                    color: "#0F172A",
                  }}
                >
                  Pipeline Activity
                </h3>

                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={pipelineData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="runs"
                      fill="#2563EB"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow:
                    "0 10px 30px rgba(15,23,42,0.06)",
                  border: "1px solid #E2E8F0",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    color: "#0F172A",
                  }}
                >
                  AI Copilot
                </h3>

                <p
                  style={{
                    color: "#64748B",
                    lineHeight: 1.6,
                  }}
                >
                  Ask CortexOS about pipeline failures,
                  datasets, AI insights, SQL generation, and
                  data quality recommendations.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setActivePage("AI Copilot")
                  }
                  style={{
                    marginTop: "14px",
                    background: "#2563EB",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Open AI Copilot
                </button>
              </div>
            </div>
          </>
        )}

        {activePage === "Datasets" && <Datasets />}

        {activePage === "Pipelines" && <Pipelines />}

        {activePage === "Data Quality" && (
          <DataQuality />
        )}

        {activePage === "AI Copilot" && (
          <AICopilot />
        )}

        {activePage === "Alerts" && <Alerts />}

        {activePage === "Users" && <Users />}

        {activePage === "Settings" && (
          <Settings />
        )}
      </main>
    </div>
  );
}

export default App;