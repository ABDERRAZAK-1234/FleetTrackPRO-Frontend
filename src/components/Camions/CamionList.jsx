
import { useState } from "react";
import { camionApi } from "../../services/api";
import CamionForm from "./CamionForm";
import CamionActions from "./CamionActions";
import "./CamionList.css";

const initialFormData = {
  nom: "",
  marque: "",
  immatriculation: "",
  modele: "",
  kilometrage: "",
  statut: "DISPONIBLE",
  dateMiseEnService: "",
};

function CamionList() {
  const [camions, setCamions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCamion, setEditingCamion] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  function getErrorMessage(error) {
    if (error.status === 401) {
      return "Votre session a expiré. Veuillez vous reconnecter.";
    }

    if (error.status === 403) {
      return "Accès refusé.";
    }

    return error.message || "Une erreur est survenue.";
  }

  async function handleLoadCamions() {
    try {
      setLoading(true);
      setError("");

      const response = await camionApi.getAll();
      setCamions(response.data || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  function handleAddClick() {
    setEditingCamion(null);
    setFormData(initialFormData);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function handleEditClick(camion) {
    setEditingCamion(camion);
    setFormData({
      nom: camion.nom || "",
      marque: camion.marque || "",
      immatriculation: camion.immatriculation || "",
      modele: camion.modele || "",
      kilometrage: String(camion.kilometrage ?? ""),
      statut: camion.statut || "DISPONIBLE",
      dateMiseEnService: camion.dateMiseEnService
        ? camion.dateMiseEnService.slice(0, 10)
        : "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingCamion(null);
    setFormData(initialFormData);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = {
        ...formData,
        kilometrage: Number(formData.kilometrage),
      };

      if (editingCamion) {
        await camionApi.update(editingCamion._id, data);
        setSuccess("Camion modifié avec succès.");
      } else {
        await camionApi.create(data);
        setSuccess("Camion ajouté avec succès.");
      }

      handleCancelForm();
      await handleLoadCamions();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive(camion) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment archiver le camion ${camion.nom} ?`
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await camionApi.delete(camion._id);

      setSuccess("Camion archivé avec succès.");
      await handleLoadCamions();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSaving(false);
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
            Consultez et gérez les camions de votre flotte.
          </p>
        </div>

        <div className="camions-header-actions">
          <button
            className="camions-load-btn"
            onClick={handleLoadCamions}
            disabled={loading || saving}
          >
            {loading ? "Chargement..." : "Actualiser"}
          </button>

          <button
            className="camions-add-btn"
            onClick={handleAddClick}
            disabled={saving}
          >
            Ajouter un camion
          </button>
        </div>
      </div>

      {error && (
        <p className="camions-message camions-error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="camions-message camions-success" role="status">
          {success}
        </p>
      )}

      {showForm && (
        <CamionForm
          camion={editingCamion}
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          loading={saving}
        />
      )}

      {loading && camions.length === 0 && (
        <p className="camions-message camions-loading">
          Chargement des camions...
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
                <th>Actions</th>
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
                    {Number(camion.kilometrage).toLocaleString("fr-FR")} km
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
                  <td>
                    <CamionActions
                      camion={camion}
                      onEdit={handleEditClick}
                      onArchive={handleArchive}
                      disabled={saving}
                    />
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
