import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import "./ConfirmModal.css";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  danger = true,
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="confirm-body">
        <div className={`confirm-icon ${danger ? "danger" : ""}`}>
          <AlertTriangle size={22} />
        </div>
        <p className="confirm-message">{message}</p>
      </div>
      <div className="confirm-actions">
        <Button variant="secondary" onClick={onClose} fullWidth>
          Cancel
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading} fullWidth>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
