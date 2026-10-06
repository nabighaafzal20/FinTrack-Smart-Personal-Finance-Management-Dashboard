import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Receipt } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import { formatSignedCurrency } from "../../utils/formatters";
import { formatDate } from "../../utils/dateUtils";
import { ArrowLeftRight } from "lucide-react";
import "./RecentTransactions.css";

export default function RecentTransactions({
  transactions,
  currency,
  onEdit,
  onDelete,
  onViewReceipt,
  onAdd,
  limit = 6,
}) {
  const navigate = useNavigate();
  const items = transactions.slice(0, limit);

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={ArrowLeftRight}
        title="No transactions yet"
        message="Start tracking your spending by adding your first expense."
        actionLabel="Add Expense"
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="recent-txn-list">
      {items.map((t) => (
        <div className="recent-txn-row" key={t.id}>
          <CategoryIcon category={t.category} type={t.type} />
          <div className="recent-txn-info">
            <span className="recent-txn-title">{t.title}</span>
            <span className="recent-txn-meta">{t.category} · {formatDate(t.date)}</span>
          </div>
          <span className={`recent-txn-amount ${t.type}`}>
            {formatSignedCurrency(t.amount, t.type, currency)}
          </span>
          <div className="recent-txn-actions">
            {t.receipt && (
              <button onClick={() => onViewReceipt(t)} aria-label="View receipt" title="View receipt">
                <Receipt size={14} />
              </button>
            )}
            <button onClick={() => onEdit(t)} aria-label="Edit transaction" title="Edit">
              <Pencil size={14} />
            </button>
            <button onClick={() => onDelete(t)} aria-label="Delete transaction" title="Delete" className="danger">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      <div style={{ textAlign: "center", paddingTop: 6 }}>
        <Button variant="ghost" size="sm" onClick={() => navigate("/transactions")}>
          View All Transactions
        </Button>
      </div>
    </div>
  );
}
