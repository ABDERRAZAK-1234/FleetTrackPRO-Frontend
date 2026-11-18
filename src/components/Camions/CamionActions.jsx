
function CamionActions({ camion, onEdit, onArchive, disabled }) {
  return (
    <div className="camion-actions">
      <button
        type="button"
        className="camion-edit-btn"
        onClick={() => onEdit(camion)}
        disabled={disabled}
      >
        Modifier
      </button>

      <button
        type="button"
        className="camion-archive-btn"
        onClick={() => onArchive(camion)}
        disabled={disabled || camion.statut === "ARCHIVE"}
      >
        Archiver
      </button>
    </div>
  );
}

export default CamionActions;
