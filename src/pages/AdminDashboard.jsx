function AdminDashboard({ onLogout }) {
  return (
    <div>
      <h1>Admin Dashboard</h1>

      <button onClick={onLogout}>
        Se déconnecter
      </button>
    </div>
  );
}

export default AdminDashboard;