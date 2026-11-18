
import { useState } from "react";
import { camionApi } from "../../services/api";
import "./CamionList.css";

function CamionList() {
  const [camions, setCamions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLoadCamions() {
    try {
      setLoading(true);
      setError("");

      const response = await camionApi.getAll();
      setCamions(response.data);
    } catch (error) {
      if (error.status === 401) {
        setError("Votre session a expiré. Veuillez vous reconnecter.");
      } else if (error.status === 403) {
        setError("Accès refusé.");
      } else {
        setError(error.message || "Impossible de charger les camions.");
      }
    } finally {
      setLoading(false);
    }
  }

  function getStatusClass(status) {
    const statusClasses = {
      DISPONIBLE: "status-disponible",
      EN_SERVICE: "status-en-service",
      MAINTENANCE: "status-maintenance",
      ARCHIVE: "status-archive",
    };

    return statusClasses[status] || "";
  }

  return (
    <section className="camions-container">
      <div className="camions-header">
        <div>
          <h2 className="camions-title">Gestion des camions</h2>
          <p className="camions-description">
            Consultez la liste des camions de votre flotte.
          </p>
        </div>

        <button
          className="camions-load-btn"
          onClick={handleLoadCamions}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Charger les camions"}
        </button>
      </div>

      {loading && (
        <p className="camions-message camions-loading">
          Chargement des camions...
        </p>
      )}

      {error && (
        <p className="camions-message camions-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && camions.length === 0 && (
        <p className="camions-message camions-empty">
          Aucun camion à afficher.
        </p>
      )}

      {camions.length > 0 && (
        <div className="camions-table-wrapper">
          <table className="camions-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Marque</th>
                <th>Immatriculation</th>
                <th>Modèle</th>
                <th>Kilométrage</th>
                <th>Statut</th>
                <th>Date de mise en service</th>
              </tr>
            </thead>

            <tbody>
              {camions.map((camion) => (
                <tr key={camion._id}>
                  <td className="camion-name">{camion.nom}</td>
                  <td>{camion.marque}</td>
                  <td>{camion.immatriculation}</td>
                  <td>{camion.modele}</td>
                  <td>
                    {camion.kilometrage.toLocaleString("fr-FR")} km
                  </td>
                  <td>
                    <span
                      className={`camion-status ${getStatusClass(camion.statut)}`}
                    >
                      {camion.statut}
                    </span>
                  </td>
                  <td>
                    {new Date(camion.dateMiseEnService).toLocaleDateString(
                      "fr-FR"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default CamionList;
