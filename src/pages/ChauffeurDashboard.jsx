function ChauffeurDashboard({ onLogout }) {
  return (
    <div>
      <h1>Chauffeur Dashboard</h1>

      <button onClick={onLogout}>
        Se déconnecter
      </button>
    </div>
  );
}

export default ChauffeurDashboard;