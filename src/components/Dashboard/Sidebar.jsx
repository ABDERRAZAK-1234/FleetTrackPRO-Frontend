
import "./Sidebar.css";

function Sidebar({
  menuItems,
  activeSection,
  onSectionChange,
  onLogout,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>FleetTrack<span>PRO</span></h2>
        <small>Transport Management</small>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-link ${
              activeSection === item.id ? "active" : ""
            }`}
            onClick={() => onSectionChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={onLogout}>
        Se déconnecter
      </button>
    </aside>
  );
}

export default Sidebar;
