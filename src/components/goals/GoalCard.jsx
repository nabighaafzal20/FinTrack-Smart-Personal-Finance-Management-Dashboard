import { Pencil, Trash2, PlusCircle, Target as TargetIcon } from "lucide-react";
import ProgressBar from "../ui/ProgressBar";
import { formatCurrency, formatPercent } from "../../utils/formatters";
import { formatDate, daysUntil } from "../../utils/dateUtils";
import { calculateGoalProgress } from "../../utils/calculations";
import "./GoalCard.css";

export default function GoalCard({ goal, currency, onEdit, onDelete, onAddMoney }) {
  const progress = calculateGoalProgress(goal);
  const days = goal.deadline ? daysUntil(goal.deadline) : null;
  const achieved = progress >= 100;

  return (
    <div className={`goal-card ${achieved ? "achieved" : ""}`}>
      <div className="goal-card-top">
        <div className="goal-icon"><TargetIcon size={18} /></div>
        <div className="goal-card-title">
          <span>{goal.name}</span>
          {goal.deadline && (
            <span className="goal-deadline">
              {days >= 0 ? `${days} days left` : "Overdue"} · {formatDate(goal.deadline)}
            </span>
          )}
        </div>
        <div className="goal-card-actions">
          <button onClick={() => onEdit(goal)} aria-label="Edit goal" title="Edit"><Pencil size={14} /></button>
          <button onClick={() => onDelete(goal)} aria-label="Delete goal" title="Delete" className="danger"><Trash2 size={14} /></button>
        </div>
      </div>

      {goal.description && <p className="goal-desc">{goal.description}</p>}

      <ProgressBar value={goal.currentAmount} max={goal.targetAmount} variant={achieved ? "success" : "brand"} height={10} />

      <div className="goal-card-figures">
        <span>{formatCurrency(goal.currentAmount, currency)} saved</span>
        <span className="goal-pct">{formatPercent(progress)}</span>
      </div>
      <div className="goal-card-target">Target: {formatCurrency(goal.targetAmount, currency)}</div>

      <button className="goal-add-money-btn" onClick={() => onAddMoney(goal)} disabled={achieved}>
        <PlusCircle size={15} /> {achieved ? "Goal Achieved!" : "Add Money"}
      </button>
    </div>
  );
}
