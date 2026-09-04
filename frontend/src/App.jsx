import { useCallback, useEffect, useState } from "react";
import { buildApiUrl } from "./config/api";
import Users from "./components/Users";
import Sidebar from "./components/sidebar";
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
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setDashboardLoading(true);
      setDashboardError("");

      const response = await fetch(buildApiUrl("/dashboard"));

      if (!response.ok) {
        throw new Error(`Dashboard request failed: ${response.status}`);
      }

      const data = await response.json();
      setDashboard(data && typeof data === "object" ? data : null);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setDashboard(null);
      setDashboardError("Could not load dashboard data.");
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = [
    {
      title: "Total Datasets",
      value: dashboard ? dashboard.totalDatasets : 0,
      change: "Live",
    },
    {
      title: "Healthy",
      value: dashboard ? dashboard.healthy : 0,
      change: "Database",
    },
    {
      title: "Warning",
      value: dashboard ? dashboard.warning : 0,
      change: "Needs Review",
    },
    {
      title: "Total Records",
      value: dashboard
        ? Number(dashboard.totalRecords || 0).toLocaleString()
        : "0",
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

  const renderDashboard = () => {
    if (dashboardLoading) {
      return (
        <div style={styles.dashboardStateCard}>
          <span className="loading-spinner" aria-hidden="true" />
          <div>
            <strong style={styles.dashboardStateTitle}>Loading dashboard</strong>
            <p style={styles.dashboardStateText}>Fetching the latest CortexOS metrics.</p>
          </div>
        </div>
      );
    }

    if (dashboardError) {
      return (
        <div style={styles.dashboardErrorCard}>
          <strong style={styles.dashboardStateTitle}>Dashboard unavailable</strong>
          <p style={styles.dashboardStateText}>{dashboardError}</p>
          <button type="button" onClick={loadDashboard} style={styles.retryButton}>
            Retry
          </button>
        </div>
      );
    }

    if (!dashboard) {
      return (
        <div style={styles.dashboardStateCard}>
          <div>
            <strong style={styles.dashboardStateTitle}>No dashboard data yet</strong>
            <p style={styles.dashboardStateText}>CortexOS has not returned any dashboard metrics.</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <StatsCards stats={stats} />

        <div style={styles.dashboardGrid}>
          <div style={styles.dashboardCard}>
            <h3 style={styles.cardTitle}>Pipeline Activity</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={pipelineData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="runs" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.dashboardCard}>
            <h3 style={styles.cardTitle}>AI Copilot</h3>
            <p style={styles.cardText}>
              Ask CortexOS about pipeline failures, datasets, AI insights, SQL generation,
              and data quality recommendations.
            </p>
            <button
              type="button"
              onClick={() => setActivePage("AI Copilot")}
              style={styles.copilotButton}
            >
              Open AI Copilot
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={styles.appShell}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main style={styles.main}>
        <Header />

        {activePage === "Datasets" && <SearchBar />}
        {activePage === "Dashboard" && renderDashboard()}
        {activePage === "Datasets" && <Datasets />}
        {activePage === "Pipelines" && <Pipelines />}
        {activePage === "Data Quality" && <DataQuality />}
        {activePage === "AI Copilot" && <AICopilot />}
        {activePage === "Alerts" && <Alerts />}
        {activePage === "Users" && <Users />}
        {activePage === "Settings" && <Settings />}
      </main>
    </div>
  );
}

const styles = {
  appShell: {
    display: "flex",
    minHeight: "100vh",
    background: "#F8FAFC",
    color: "#0F172A",
    fontFamily: "Inter, sans-serif",
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: "clamp(18px, 2vw, 32px)",
    overflowY: "auto",
    background: "#F8FAFC",
  },
  dashboardStateCard: {
    minHeight: "220px",
    marginTop: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "28px",
    textAlign: "center",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
  },
  dashboardErrorCard: {
    marginTop: "24px",
    padding: "24px",
    textAlign: "center",
    background: "#FEF2F2",
    border: "1px solid #FCA5A5",
    borderRadius: "16px",
  },
  dashboardStateTitle: {
    display: "block",
    color: "#0F172A",
    fontSize: "1rem",
    marginBottom: "6px",
  },
  dashboardStateText: { color: "#64748B", lineHeight: 1.6 },
  retryButton: {
    marginTop: "14px",
    border: "1px solid #BFDBFE",
    borderRadius: "10px",
    background: "#EFF6FF",
    color: "#1D4ED8",
    padding: "9px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
    gap: "20px",
    marginTop: "30px",
  },
  dashboardCard: {
    background: "#FFFFFF",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
    border: "1px solid #E2E8F0",
  },
  cardTitle: { marginTop: 0, marginBottom: "20px", color: "#0F172A" },
  cardText: { color: "#64748B", lineHeight: 1.6 },
  copilotButton: {
    marginTop: "14px",
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default App;
