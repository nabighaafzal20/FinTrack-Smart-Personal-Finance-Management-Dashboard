import { useState } from "react";
import { PiggyBank, Plus } from "lucide-react";
import { useFinance } from "../hooks/useFinance";
import { useSettings } from "../hooks/useSettings";
import BudgetCard from "../components/budgets/BudgetCard";
import BudgetFormModal from "../components/budgets/BudgetFormModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { SkeletonCard } from "../components/ui/Skeleton";
import { monthKey } from "../utils/dateUtils";

export default function Budgets() {
  const { budgets, transactions, isLoading, deleteBudget } = useFinance();
  const { settings } = useSettings();
  const currency = settings?.currency || "PKR";

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const currentMonth = monthKey(new Date().toISOString());
  const currentBudgets = budgets.filter((b) => b.month === currentMonth);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Budgets</h1>
          <p>Set spending limits by category and track usage in real time.</p>
        </div>
        <div className="page-header-actions">
          <Button icon={Plus} onClick={() => { setEditing(null); setModalOpen(true); }}>
            Add Budget
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="card-grid">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>
      ) : currentBudgets.length === 0 ? (
        <EmptyState
          icon={PiggyBank}
          title="No budgets created yet"
          message="Set a monthly budget for a category to start tracking your spending against it."
          actionLabel="Add Budget"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="card-grid">
          {currentBudgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              transactions={transactions}
              currency={currency}
              onEdit={(budget) => { setEditing(budget); setModalOpen(true); }}
              onDelete={(budget) => setDeleteTarget(budget)}
            />
          ))}
        </div>
      )}

      <BudgetFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        initialData={editing}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { deleteBudget(deleteTarget.id); setDeleteTarget(null); }}
        title="Delete budget?"
        message={`This will remove the ${deleteTarget?.category} budget. This cannot be undone.`}
      />
    </div>
  );
}
