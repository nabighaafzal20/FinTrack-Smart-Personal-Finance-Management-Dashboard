import { Pencil, Trash2 } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";
import ProgressBar from "../ui/ProgressBar";
import { formatCurrency, formatPercent } from "../../utils/formatters";
import { calculateBudgetUsage } from "../../utils/calculations";
import "./BudgetCard.css";

export default function BudgetCard({ budget, transactions, currency, onEdit, onDelete }) {
  const { used, remaining, percentage } = calculateBudgetUsage(budget, transactions);

  return (
    <div className="budget-card">
      <div className="budget-card-top">
        <CategoryIcon category={budget.category} type="expense" size={20} />
        <div className="budget-card-title">
          <span>{budget.category}</span>
          <span className="budget-card-sub">Monthly Budget</span>
        </div>
        <div className="budget-card-actions">
          <button onClick={() => onEdit(budget)} aria-label="Edit budget" title="Edit"><Pencil size={14} /></button>
          <button onClick={() => onDelete(budget)} aria-label="Delete budget" title="Delete" className="danger"><Trash2 size={14} /></button>
        </div>
      </div>

      <ProgressBar value={used} max={budget.amount} />

      <div className="budget-card-figures">
        <span>{formatCurrency(used, currency)} <em>used</em></span>
        <span>{formatCurrency(budget.amount, currency)} <em>budget</em></span>
      </div>

      <div className="budget-card-footer">
        <span className={remaining < 0 ? "over" : ""}>
          {remaining < 0 ? `Over by ${formatCurrency(Math.abs(remaining), currency)}` : `${formatCurrency(remaining, currency)} remaining`}
        </span>
        <span className={`budget-pct ${percentage >= 100 ? "danger" : percentage >= 80 ? "warning" : "success"}`}>
          {formatPercent(percentage)}
        </span>
      </div>
    </div>
  );
}
