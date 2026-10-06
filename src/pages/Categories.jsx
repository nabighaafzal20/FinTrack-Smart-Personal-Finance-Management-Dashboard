import { useState } from "react";
import { Tags, Plus } from "lucide-react";
import { useFinance } from "../hooks/useFinance";
import CategoryFormModal from "../components/categories/CategoryFormModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import CategoryIcon from "../components/ui/CategoryIcon";
import { getIcon } from "../utils/iconMap";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Categories() {
  const { categories, transactions, deleteCategory } = useFinance();
  const [tab, setTab] = useState("expense");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const list = categories.filter((c) => c.type === tab);

  const handleDelete = (cat) => {
    const inUse = transactions.some((t) => t.category === cat.name && t.type === cat.type);
    if (inUse) {
      toast.error("Cannot delete a category that has transactions. Reassign or delete those transactions first.");
      return;
    }
    setDeleteTarget(cat);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Organize your income and expenses with custom categories.</p>
        </div>
        <div className="page-header-actions">
          <Button icon={Plus} onClick={() => { setEditing(null); setModalOpen(true); }}>
            New Category
          </Button>
        </div>
      </div>

      <div className="type-toggle" style={{ maxWidth: 280, marginBottom: 20 }}>
        <button className={tab === "expense" ? "active expense" : ""} onClick={() => setTab("expense")}>Expense</button>
        <button className={tab === "income" ? "active income" : ""} onClick={() => setTab("income")}>Income</button>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Tags} title="No categories yet" message="Create your first category to organize transactions." actionLabel="New Category" onAction={() => setModalOpen(true)} />
      ) : (
        <div className="card-grid">
          {list.map((cat) => {
            const count = transactions.filter((t) => t.category === cat.name && t.type === cat.type).length;
            return (
              <Card key={cat.id} className="category-card">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CategoryIcon category={cat.name} type={cat.type} size={20} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>{cat.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{count} transaction{count === 1 ? "" : "s"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="icon-action" onClick={() => { setEditing(cat); setModalOpen(true); }} aria-label="Edit category" title="Edit">
                      <Pencil size={14} />
                    </button>
                    {!cat.isDefault && (
                      <button className="icon-action danger" onClick={() => handleDelete(cat)} aria-label="Delete category" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <CategoryFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} initialData={editing} defaultType={tab} />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { deleteCategory(deleteTarget.id); setDeleteTarget(null); }}
        title="Delete category?"
        message={`This will remove "${deleteTarget?.name}". This cannot be undone.`}
      />
    </div>
  );
}
