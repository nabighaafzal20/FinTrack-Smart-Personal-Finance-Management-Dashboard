import { ArrowDownCircle, ArrowUpCircle, PiggyBank, Target, RefreshCw } from "lucide-react";
import "./QuickActions.css";

export default function QuickActions({ onAction }) {
  const actions = [
    { key: "expense", label: "Add Expense", icon: ArrowDownCircle },
    { key: "income", label: "Add Income", icon: ArrowUpCircle },
    { key: "budget", label: "Add Budget", icon: PiggyBank },
    { key: "goal", label: "Create Goal", icon: Target },
    { key: "subscription", label: "Add Subscription", icon: RefreshCw },
  ];

  return (
    <div className="quick-actions">
      {actions.map(({ key, label, icon: Icon }) => (
        <button key={key} className="quick-action-btn" onClick={() => onAction(key)}>
          <span className="quick-action-icon">
            <Icon size={20} />
          </span>
          {label}
        </button>
      ))}
    </div>
  );
}
