import { useState } from "react";
import { useAuth } from "./context/useAuth";

import Login from "./components/Login/Login";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ChauffeurDashboard from "./pages/ChauffeurDashboard";
import Unauthorized from "./pages/Unauthorized";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const { user, login, logout, loading } = useAuth();

  function handleLoginSuccess(userData) {
    login(userData);

    switch (userData.role) {
      case "SUPER_ADMIN":
        setCurrentPage("super-admin");
        break;

      case "ADMIN":
        setCurrentPage("admin");
        break;

      case "CHAUFFEUR":
        setCurrentPage("chauffeur");
        break;

      default:
        setCurrentPage("unauthorized");
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error(error.message);
    }
  }

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  switch (user.role) {
    case "SUPER_ADMIN":
      return <SuperAdminDashboard onLogout={handleLogout} />;

    case "ADMIN":
      return <AdminDashboard onLogout={handleLogout} />;

    case "CHAUFFEUR":
      return <ChauffeurDashboard onLogout={handleLogout} />;

    default:
      return <Unauthorized />;
  }
}

export default App;
