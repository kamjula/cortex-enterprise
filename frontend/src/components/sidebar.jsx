import "./sidebar.css";

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

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">CortexOS</div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            type="button"
            key={item}
            className={`sidebar-nav-item ${
              activePage === item ? "active" : ""
            }`}
            onClick={() => onNavigate(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-avatar"></div>
        <div className="sidebar-user-text">
          <div className="sidebar-user-name">Sravani Kamjula</div>
          <div className="sidebar-user-role">Data Platform Engineer</div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;