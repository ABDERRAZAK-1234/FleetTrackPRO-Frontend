
import "./CamionForm.css";

function CamionForm({
  camion,
  formData,
  onChange,
  onSubmit,
  onCancel,
  loading,
}) {
  const isEditing = Boolean(camion);

  return (
    <form className="camion-form" onSubmit={onSubmit}>
      <h3>{isEditing ? "Modifier le camion" : "Ajouter un camion"}</h3>

      <div className="camion-form-grid">
        <label>
          Nom
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={onChange}
            required
            minLength={2}
            maxLength={100}
          />
        </label>

        <label>
          Marque
          <input
            type="text"
            name="marque"
            value={formData.marque}
            onChange={onChange}
            required
            minLength={2}
            maxLength={50}
          />
        </label>

        <label>
          Immatriculation
          <input
            type="text"
            name="immatriculation"
            value={formData.immatriculation}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Modèle
          <input
            type="text"
            name="modele"
            value={formData.modele}
            onChange={onChange}
            required
            maxLength={100}
          />
        </label>

        <label>
          Kilométrage
          <input
            type="number"
            name="kilometrage"
            value={formData.kilometrage}
            onChange={onChange}
            min="0"
            required
          />
        </label>

        <label>
          Statut
          <select
            name="statut"
            value={formData.statut}
            onChange={onChange}
          >
            <option value="DISPONIBLE">Disponible</option>
            <option value="EN_SERVICE">En service</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="ARCHIVE">Archivé</option>
          </select>
        </label>

        <label>
          Date de mise en service
          <input
            type="date"
            name="dateMiseEnService"
            value={formData.dateMiseEnService}
            onChange={onChange}
            required
          />
        </label>
      </div>

      <div className="camion-form-actions">
        <button type="submit" disabled={loading}>
          {loading
            ? "Enregistrement..."
            : isEditing
              ? "Enregistrer les modifications"
              : "Ajouter le camion"}
        </button>

        <button
          type="button"
          className="camion-cancel-btn"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default CamionForm;
