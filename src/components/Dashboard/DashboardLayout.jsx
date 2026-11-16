
import "./DashboardLayout.css";
import Sidebar from "./Sidebar";

function DashboardLayout({
  title,
  menuItems,
  activeSection,
  onSectionChange,
  user,
  onLogout,
  children,
}) {
  return (
    <div className="dashboard">
      <Sidebar
        menuItems={menuItems}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        onLogout={onLogout}
      />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>{title}</h1>
            <p>Bienvenue sur FleetTrackPRO</p>
          </div>

          <div className="dashboard-user">
            <span>{user?.prenom} {user?.nom}</span>
            <span className="dashboard-role">{user?.role}</span>
          </div>
        </header>

        <section className="dashboard-content">
          {children}
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;
