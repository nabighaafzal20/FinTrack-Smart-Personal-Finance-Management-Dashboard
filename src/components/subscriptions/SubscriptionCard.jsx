import { Pencil, Trash2, RefreshCw } from "lucide-react";
import { formatCurrency, capitalize } from "../../utils/formatters";
import { formatDate, daysUntil } from "../../utils/dateUtils";
import Badge from "../ui/Badge";
import "./SubscriptionCard.css";

export default function SubscriptionCard({ subscription, currency, onEdit, onDelete }) {
  const days = daysUntil(subscription.nextBillingDate);
  const upcoming = days !== null && days >= 0 && days <= 7;

  return (
    <div className="sub-card">
      <div className="sub-card-top">
        <div className="sub-icon"><RefreshCw size={18} /></div>
        <div className="sub-card-title">
          <span>{subscription.name}</span>
          <span className="sub-card-cat">{subscription.category}</span>
        </div>
        <div className="sub-card-actions">
          <button onClick={() => onEdit(subscription)} aria-label="Edit subscription" title="Edit"><Pencil size={14} /></button>
          <button onClick={() => onDelete(subscription)} aria-label="Delete subscription" title="Delete" className="danger"><Trash2 size={14} /></button>
        </div>
      </div>

      <div className="sub-card-amount">{formatCurrency(subscription.amount, currency)}
        <span className="sub-cycle">/ {capitalize(subscription.billingCycle)}</span>
      </div>

      <div className="sub-card-footer">
        <span>Next: {formatDate(subscription.nextBillingDate)}</span>
        {upcoming && <Badge variant="warning" size="sm">Due in {days}d</Badge>}
      </div>
    </div>
  );
}
