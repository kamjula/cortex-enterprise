import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div>
        <h1>Enterprise Data Platform</h1>
        <p>Unified view of datasets, pipelines, quality checks, and AI insights.</p>
      </div>

      <div className="header-right">
        <input className="search-box" type="text" placeholder="Search..." />
        <button className="header-btn">🔔</button>
        <img
          className="profile-img"
          src="https://i.pravatar.cc/100"
          alt="Profile"
        />
      </div>
    </header>
  );
}

export default Header;