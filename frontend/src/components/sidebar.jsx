import "./Sidebar.css";

const menuItems = [
  "Dashboard",
  "Datasets",
  "Pipelines",
  "Data Quality",
  "AI Copilot",
  "Alerts",
  "Users",
  "Settings",
];

function Sidebar({ activePage = "Dashboard", onNavigate = () => {} }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">CortexOS</div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item}
            className={
              activePage === item
                ? "sidebar-nav-item active"
                : "sidebar-nav-item"
            }
            onClick={() => onNavigate(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-avatar"></div>
        <div className="sidebar-user-name">Sravani</div>
      </div>
    </aside>
  );
}

export default Sidebar;