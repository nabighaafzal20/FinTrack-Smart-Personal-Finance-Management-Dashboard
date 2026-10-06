import { useMemo, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useFinance } from "../hooks/useFinance";
import { useSettings } from "../hooks/useSettings";
import Card from "../components/ui/Card";
import { SkeletonCard, SkeletonRow } from "../components/ui/Skeleton";
import StatCard from "../components/dashboard/StatCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import TransactionFormModal from "../components/transactions/TransactionFormModal";
import ReceiptModal from "../components/transactions/ReceiptModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import BudgetFormModal from "../components/budgets/BudgetFormModal";
import GoalFormModal from "../components/goals/GoalFormModal";
import SubscriptionFormModal from "../components/subscriptions/SubscriptionFormModal";
import Button from "../components/ui/Button";
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateBalance,
  calculateSavingsRate,
} from "../utils/calculations";
import { formatCurrency, formatPercent } from "../utils/formatters";
import { hasDemoData, loadDemoData } from "../services/demoDataService";

export default function Dashboard() {
  const { user } = useAuth();
  const { transactions, isLoading, deleteTransaction, refreshAll } = useFinance();
  const { settings } = useSettings();
  const currency = settings?.currency || "PKR";

  const [modalType, setModalType] = useState(null);
  const [editTxn, setEditTxn] = useState(null);
  const [receiptTxn, setReceiptTxn] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const now = new Date();
  const thisMonthTxns = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthTxns = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
  });

  const stats = useMemo(() => {
    const income = calculateTotalIncome(thisMonthTxns);
    const expenses = calculateTotalExpenses(thisMonthTxns);
    const balance = calculateBalance(transactions);
    const savingsRate = calculateSavingsRate(thisMonthTxns);

    const lastIncome = calculateTotalIncome(lastMonthTxns);
    const lastExpenses = calculateTotalExpenses(lastMonthTxns);
    const lastSavingsRate = calculateSavingsRate(lastMonthTxns);
    const lastBalance = calculateBalance(lastMonthTxns);

    const pctChange = (curr, prev) => (prev > 0 ? ((curr - prev) / prev) * 100 : curr > 0 ? 100 : 0);

    return {
      income,
      expenses,
      balance,
      savingsRate,
      incomeChange: lastMonthTxns.length ? pctChange(income, lastIncome) : undefined,
      expenseChange: lastMonthTxns.length ? pctChange(expenses, lastExpenses) : undefined,
      balanceChange: lastMonthTxns.length ? pctChange(balance, lastBalance) : undefined,
      savingsRateChange: lastMonthTxns.length ? savingsRate - lastSavingsRate : undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, thisMonthTxns.length, lastMonthTxns.length]);

  const greeting = () => {
    const h = now.getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleAction = (key) => {
    if (key === "expense" || key === "income") {
      setEditTxn(null);
      setModalType(key);
    } else if (key === "budget") setModalType("budget");
    else if (key === "goal") setModalType("goal");
    else if (key === "subscription") setModalType("subscription");
  };

  const handleLoadDemo = () => {
    if (!user) return;
    loadDemoData(user.id);
    refreshAll();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{greeting()}, {user?.name?.split(" ")[0]}</h1>
          <p>{now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        {!hasDemoData(user?.id) && transactions.length === 0 && (
          <Button variant="secondary" icon={Sparkles} onClick={handleLoadDemo}>
            Load Demo Data
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="loading-grid" style={{ marginBottom: 24 }}>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="stat-grid">
          <StatCard icon={Wallet} label="Total Balance" value={formatCurrency(stats.balance, currency)} tone="brand" />
          <StatCard icon={TrendingUp} label="Total Income" value={formatCurrency(stats.income, currency)} change={stats.incomeChange} tone="success" />
          <StatCard icon={TrendingDown} label="Total Expenses" value={formatCurrency(stats.expenses, currency)} change={stats.expenseChange !== undefined ? -stats.expenseChange : undefined} tone="danger" />
          <StatCard icon={PiggyBank} label="Savings Rate" value={formatPercent(stats.savingsRate)} change={stats.savingsRateChange} tone="warning" />
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div className="section-title-row">
          <h3>Quick Actions</h3>
        </div>
        <QuickActions onAction={handleAction} />
      </div>

      <div className="two-col-grid">
        <Card>
          <div className="section-title-row">
            <h3>Recent Transactions</h3>
          </div>
          {isLoading ? (
            <div>{[1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}</div>
          ) : (
            <RecentTransactions
              transactions={transactions}
              currency={currency}
              onEdit={(t) => { setEditTxn(t); setModalType(t.type); }}
              onDelete={(t) => setDeleteTarget(t)}
              onViewReceipt={(t) => setReceiptTxn(t)}
              onAdd={() => handleAction("expense")}
            />
          )}
        </Card>

        <Card>
          <div className="section-title-row">
            <h3>This Month Snapshot</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SnapshotRow label="Income" value={formatCurrency(stats.income, currency)} color="var(--income-color)" />
            <SnapshotRow label="Expenses" value={formatCurrency(stats.expenses, currency)} color="var(--expense-color)" />
            <SnapshotRow label="Net Savings" value={formatCurrency(stats.income - stats.expenses, currency)} color="var(--brand-500)" />
            <SnapshotRow label="Savings Rate" value={formatPercent(stats.savingsRate)} color="var(--warning-500)" />
          </div>
        </Card>
      </div>

      <TransactionFormModal
        open={modalType === "expense" || modalType === "income"}
        onClose={() => { setModalType(null); setEditTxn(null); }}
        type={modalType === "income" ? "income" : "expense"}
        initialData={editTxn}
      />
      <BudgetFormModal open={modalType === "budget"} onClose={() => setModalType(null)} />
      <GoalFormModal open={modalType === "goal"} onClose={() => setModalType(null)} />
      <SubscriptionFormModal open={modalType === "subscription"} onClose={() => setModalType(null)} />

      <ReceiptModal open={!!receiptTxn} onClose={() => setReceiptTxn(null)} receipt={receiptTxn?.receipt} title={receiptTxn?.title} />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { deleteTransaction(deleteTarget.id); setDeleteTarget(null); }}
        title="Delete transaction?"
        message={`This will permanently remove "${deleteTarget?.title}". This cannot be undone.`}
      />
    </div>
  );
}

function SnapshotRow({ label, value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--text-secondary)", fontWeight: 600 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        {label}
      </span>
      <span style={{ fontWeight: 800, fontSize: 15 }}>{value}</span>
    </div>
  );
}
