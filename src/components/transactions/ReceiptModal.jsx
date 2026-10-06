import Modal from "../ui/Modal";

export default function ReceiptModal({ open, onClose, receipt, title }) {
  return (
    <Modal open={open} onClose={onClose} title={title || "Receipt"} size="sm">
      {receipt ? (
        <img src={receipt} alt="Receipt" style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)" }} />
      ) : (
        <p style={{ color: "var(--text-muted)", textAlign: "center" }}>No receipt attached.</p>
      )}
    </Modal>
  );
}
