
import { useState } from "react";
import { userApi } from "../../services/api";
import "./UserList.css";

function UserList({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
  });

  async function handleLoadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await userApi.getAll();
      setUsers(response.data || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  function getErrorMessage(error) {
    if (error.status === 401) {
      return "Votre session a expiré. Veuillez vous reconnecter.";
    }

    if (error.status === 403) {
      return "Accès refusé. Vous n'avez pas la permission.";
    }

    if (error.status === 404) {
      return "Utilisateur introuvable.";
    }

    return error.message || "Une erreur est survenue.";
  }

  function canManageUser(targetUser) {
    const currentId = String(currentUser?.id || currentUser?._id);
    const targetId = String(targetUser._id || targetUser.id);

    if (!currentUser || currentId === targetId) {
      return false;
    }

    if (currentUser.role === "ADMIN") {
      return targetUser.role === "CHAUFFEUR";
    }

    if (currentUser.role === "SUPER_ADMIN") {
      return ["ADMIN", "CHAUFFEUR"].includes(targetUser.role);
    }

    return false;
  }

  function handleEdit(user) {
    setError("");
    setSuccess("");
    setEditingUserId(user._id || user.id);

    setFormData({
      nom: user.nom || "",
      prenom: user.prenom || "",
      email: user.email || "",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleCancelEdit() {
    setEditingUserId(null);
    setFormData({
      nom: "",
      prenom: "",
      email: "",
    });
  }

  async function handleUpdateUser(event) {
    event.preventDefault();

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await userApi.update(editingUserId, formData);

      setSuccess("Utilisateur modifié avec succès.");
      handleCancelEdit();
      await handleLoadUsers();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUserAction(action, user) {
    const userId = user._id || user.id;
    const userName = `${user.prenom || ""} ${user.nom || ""}`.trim();

    const confirmations = {
      validate: `Voulez-vous valider le compte de ${userName} ?`,
      reject: `Voulez-vous rejeter le compte de ${userName} ?`,
      suspend: `Voulez-vous suspendre le compte de ${userName} ?`,
      reactivate: `Voulez-vous réactiver le compte de ${userName} ?`,
    };

    if (!window.confirm(confirmations[action])) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await userApi[action](userId);

      const successMessages = {
        validate: "Utilisateur validé avec succès.",
        reject: "Utilisateur rejeté avec succès.",
        suspend: "Utilisateur suspendu avec succès.",
        reactivate: "Utilisateur réactivé avec succès.",
      };

      setSuccess(successMessages[action]);
      await handleLoadUsers();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  }

  function getStatusClass(statut) {
    const classes = {
      ACTIF: "user-status-active",
      EN_ATTENTE: "user-status-pending",
      REJETE: "user-status-rejected",
      SUSPENDU: "user-status-suspended",
    };

    return classes[statut] || "";
  }

  return (
    <section className="users-container">
      <div className="users-header">
        <div>
          <h2 className="users-title">Gestion des utilisateurs</h2>
          <p className="users-description">
            Consultez et gérez les comptes des utilisateurs.
          </p>
        </div>

        <button
          className="users-load-btn"
          onClick={handleLoadUsers}
          disabled={loading || actionLoading}
        >
          {loading ? "Chargement..." : "Charger les utilisateurs"}
        </button>
      </div>

      {error && (
        <p className="users-message users-error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="users-message users-success" role="status">
          {success}
        </p>
      )}

      {editingUserId && (
        <form className="user-edit-form" onSubmit={handleUpdateUser}>
          <h3>Modifier l'utilisateur</h3>

          <div className="user-form-grid">
            <label>
              Nom
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleFormChange}
                required
                minLength={2}
                maxLength={50}
              />
            </label>

            <label>
              Prénom
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleFormChange}
                required
                minLength={2}
                maxLength={50}
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </label>
          </div>

          <div className="user-form-actions">
            <button
              type="submit"
              className="user-action-btn user-btn-save"
              disabled={actionLoading}
            >
              {actionLoading ? "Enregistrement..." : "Enregistrer"}
            </button>

            <button
              type="button"
              className="user-action-btn user-btn-cancel"
              onClick={handleCancelEdit}
              disabled={actionLoading}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading && users.length === 0 && (
        <p className="users-message users-loading">
          Chargement des utilisateurs...
        </p>
      )}

      {!loading && !error && users.length === 0 && (
        <p className="users-message users-empty">
          Aucun utilisateur à afficher.
        </p>
      )}

      {users.length > 0 && (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Nom complet</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const userId = user._id || user.id;
                const manageable = canManageUser(user);

                return (
                  <tr key={userId}>
                    <td className="user-name">
                      {user.prenom} {user.nom}
                    </td>

                    <td>{user.email}</td>
                    <td>{user.role}</td>

                    <td>
                      <span
                        className={`user-status ${getStatusClass(user.statut)}`}
                      >
                        {user.statut || "Non défini"}
                      </span>
                    </td>

                    <td>
                      <div className="user-actions">
                        {manageable && user.statut === "EN_ATTENTE" && (
                          <>
                            <button
                              className="user-action-btn user-btn-validate"
                              onClick={() => handleUserAction("validate", user)}
                              disabled={actionLoading}
                            >
                              Valider
                            </button>

                            <button
                              className="user-action-btn user-btn-reject"
                              onClick={() => handleUserAction("reject", user)}
                              disabled={actionLoading}
                            >
                              Rejeter
                            </button>
                          </>
                        )}

                        {manageable && user.statut === "ACTIF" && (
                          <>
                            <button
                              className="user-action-btn user-btn-edit"
                              onClick={() => handleEdit(user)}
                              disabled={actionLoading}
                            >
                              Modifier
                            </button>

                            <button
                              className="user-action-btn user-btn-suspend"
                              onClick={() => handleUserAction("suspend", user)}
                              disabled={actionLoading}
                            >
                              Suspendre
                            </button>
                          </>
                        )}

                        {manageable && user.statut === "SUSPENDU" && (
                          <>
                            <button
                              className="user-action-btn user-btn-edit"
                              onClick={() => handleEdit(user)}
                              disabled={actionLoading}
                            >
                              Modifier
                            </button>

                            <button
                              className="user-action-btn user-btn-reactivate"
                              onClick={() =>
                                handleUserAction("reactivate", user)
                              }
                              disabled={actionLoading}
                            >
                              Réactiver
                            </button>
                          </>
                        )}

                        {!manageable && (
                          <span className="user-no-action">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default UserList;
