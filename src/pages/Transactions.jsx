import { useMemo, useState } from "react";
import { ArrowLeftRight, Plus, Download } from "lucide-react";
import { useFinance } from "../hooks/useFinance";
import { useSettings } from "../hooks/useSettings";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionTable from "../components/transactions/TransactionTable";
import TransactionFormModal from "../components/transactions/TransactionFormModal";
import TransactionDetailModal from "../components/transactions/TransactionDetailModal";
import ReceiptModal from "../components/transactions/ReceiptModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import Pagination from "../components/ui/Pagination";
import { Skeleton } from "../components/ui/Skeleton";
import { matchesDateFilter } from "../utils/dateUtils";
import { exportTransactionsToCSV } from "../utils/csvExport";

const PAGE_SIZE = 10;

export default function Transactions() {
  const { transactions, categories, isLoading, deleteTransaction } = useFinance();
  const { settings } = useSettings();
  const currency = settings?.currency || "PKR";

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
    date: "all",
    sort: "date_desc",
    customStart: "",
    customEnd: "",
  });
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState("expense");
  const [editTxn, setEditTxn] = useState(null);
  const [viewTxn, setViewTxn] = useState(null);
  const [receiptTxn, setReceiptTxn] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const categoryNames = [...new Set(categories.map((c) => c.name))].sort();

  const filtered = useMemo(() => {
    let result = transactions.filter((t) => {
      if (filters.type !== "all" && t.type !== filters.type) return false;
      if (filters.category !== "all" && t.category !== filters.category) return false;
      if (!matchesDateFilter(t.date, filters.date, { start: filters.customStart, end: filters.customEnd })) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = `${t.title} ${t.description || ""} ${t.category} ${t.paymentMethod}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      switch (filters.sort) {
        case "date_asc": return new Date(a.date) - new Date(b.date);
        case "amount_desc": return b.amount - a.amount;
        case "amount_asc": return a.amount - b.amount;
        default: return new Date(b.date) - new Date(a.date);
      }
    });

    return result;
  }, [transactions, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (updater) => {
    setFilters(updater);
    setPage(1);
  };

  const openAdd = (type) => { setEditTxn(null); setFormType(type); setFormOpen(true); };
  const openEdit = (t) => { setEditTxn(t); setFormType(t.type); setFormOpen(true); };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>{filtered.length} transaction{filtered.length === 1 ? "" : "s"} found</p>
        </div>
        <div className="page-header-actions">
          <Button variant="secondary" icon={Download} onClick={() => exportTransactionsToCSV(filtered)}>
            Export CSV
          </Button>
          <Button variant="secondary" icon={Plus} onClick={() => openAdd("income")}>
            Add Income
          </Button>
          <Button icon={Plus} onClick={() => openAdd("expense")}>
            Add Expense
          </Button>
        </div>
      </div>

      <TransactionFilters filters={filters} setFilters={handleFilterChange} categories={categoryNames} />

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height={52} radius={12} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title={transactions.length === 0 ? "No transactions yet" : "No matching transactions"}
          message={
            transactions.length === 0
              ? "Start tracking your spending by adding your first expense."
              : "Try adjusting your search or filters."
          }
          actionLabel={transactions.length === 0 ? "Add Expense" : undefined}
          onAction={transactions.length === 0 ? () => openAdd("expense") : undefined}
        />
      ) : (
        <>
          <TransactionTable
            transactions={pageItems}
            currency={currency}
            onView={setViewTxn}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onViewReceipt={setReceiptTxn}
          />
          <div style={{ marginTop: 18 }}>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </>
      )}

      <TransactionFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTxn(null); }}
        type={formType}
        initialData={editTxn}
      />
      <TransactionDetailModal open={!!viewTxn} onClose={() => setViewTxn(null)} transaction={viewTxn} currency={currency} />
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
