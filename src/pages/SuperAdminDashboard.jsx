
import { useState } from "react";
import DashboardLayout from "../components/Dashboard/DashboardLayout";

function SuperAdminDashboard({ onLogout, user }) {
  const [activeSection, setActiveSection] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Vue générale" },
    { id: "admins", label: "Administrateurs" },
    { id: "drivers", label: "Chauffeurs" },
    { id: "pending", label: "Demandes en attente" },
  ];

  function renderContent() {
    switch (activeSection) {
      case "admins":
        return <h2>Gestion des administrateurs</h2>;

      case "drivers":
        return <h2>Gestion des chauffeurs</h2>;

      case "pending":
        return <h2>Demandes en attente</h2>;

      default:
        return (
          <div>
            <h2>Vue générale</h2>
            <p>Bienvenue dans votre espace Super Admin.</p>
          </div>
        );
    }
  }

  return (
    <DashboardLayout
      title="Super Admin"
      menuItems={menuItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      user={user}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}

export default SuperAdminDashboard;
