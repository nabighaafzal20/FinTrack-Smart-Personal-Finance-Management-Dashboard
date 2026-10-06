import { useState } from "react";
import { Target, Plus } from "lucide-react";
import { useFinance } from "../hooks/useFinance";
import { useSettings } from "../hooks/useSettings";
import GoalCard from "../components/goals/GoalCard";
import GoalFormModal from "../components/goals/GoalFormModal";
import AddMoneyModal from "../components/goals/AddMoneyModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { SkeletonCard } from "../components/ui/Skeleton";

export default function Goals() {
  const { goals, isLoading, deleteGoal } = useFinance();
  const { settings } = useSettings();
  const currency = settings?.currency || "PKR";

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [addMoneyGoal, setAddMoneyGoal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Financial Goals</h1>
          <p>Set targets and watch your progress grow.</p>
        </div>
        <div className="page-header-actions">
          <Button icon={Plus} onClick={() => { setEditing(null); setModalOpen(true); }}>
            Create Goal
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="card-grid">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>
      ) : goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No financial goals created yet"
          message="Create a goal like a new laptop, car, or emergency fund and track your progress."
          actionLabel="Create Goal"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="card-grid">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              currency={currency}
              onEdit={(goal) => { setEditing(goal); setModalOpen(true); }}
              onDelete={(goal) => setDeleteTarget(goal)}
              onAddMoney={(goal) => setAddMoneyGoal(goal)}
            />
          ))}
        </div>
      )}

      <GoalFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} initialData={editing} />
      <AddMoneyModal open={!!addMoneyGoal} onClose={() => setAddMoneyGoal(null)} goal={addMoneyGoal} />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { deleteGoal(deleteTarget.id); setDeleteTarget(null); }}
        title="Delete goal?"
        message={`This will permanently remove "${deleteTarget?.name}". This cannot be undone.`}
      />
    </div>
  );
}
