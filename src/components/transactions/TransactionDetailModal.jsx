import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import CategoryIcon from "../ui/CategoryIcon";
import { formatCurrency } from "../../utils/formatters";
import { formatDate } from "../../utils/dateUtils";
import "./TransactionDetailModal.css";

export default function TransactionDetailModal({ open, onClose, transaction, currency }) {
  if (!transaction) return null;
  const t = transaction;

  return (
    <Modal open={open} onClose={onClose} title="Transaction Details" size="sm">
      <div className="txn-detail-header">
        <CategoryIcon category={t.category} type={t.type} size={26} />
        <div>
          <h3>{t.title}</h3>
          <Badge variant={t.type === "income" ? "success" : "danger"} size="sm">
            {t.type === "income" ? "Income" : "Expense"}
          </Badge>
        </div>
      </div>

      <div className={`txn-detail-amount ${t.type}`}>
        {t.type === "income" ? "+ " : "- "}{formatCurrency(t.amount, currency)}
      </div>

      <div className="txn-detail-grid">
        <DetailRow label="Category" value={t.category} />
        <DetailRow label="Date" value={formatDate(t.date, "MMMM d, yyyy")} />
        <DetailRow label="Payment Method" value={t.paymentMethod} />
        {t.isRecurring && <DetailRow label="Recurring" value={`Every ${t.recurringFrequency}`} />}
        {t.description && <DetailRow label="Description" value={t.description} />}
      </div>

      {t.receipt && (
        <div className="txn-detail-receipt">
          <span className="field-label">Receipt</span>
          <img src={t.receipt} alt="Receipt" />
        </div>
      )}
    </Modal>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="txn-detail-row">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
