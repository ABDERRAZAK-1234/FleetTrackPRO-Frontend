function Unauthorized({ onLogout }) {
  return (
    <div>
      <h1>Unauthorized</h1>

      <button onClick={onLogout}>
        Se déconnecter
      </button>
    </div>
  );
}

export default Unauthorized;