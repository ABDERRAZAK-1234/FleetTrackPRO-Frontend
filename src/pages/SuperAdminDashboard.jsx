function SuperAdminDashboard({ onLogout }) {
  return (
    <div>
      <h1>Super Admin Dashboard</h1>

      <button onClick={onLogout}>
        Se déconnecter
      </button>
    </div>
  );
}

export default SuperAdminDashboard;