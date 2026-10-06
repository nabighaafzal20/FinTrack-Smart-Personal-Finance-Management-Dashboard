import { useState } from "react";
import { RefreshCw, Plus } from "lucide-react";
import { useFinance } from "../hooks/useFinance";
import { useSettings } from "../hooks/useSettings";
import SubscriptionCard from "../components/subscriptions/SubscriptionCard";
import SubscriptionFormModal from "../components/subscriptions/SubscriptionFormModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import EmptyState from "../components/ui/EmptyState";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { SkeletonCard } from "../components/ui/Skeleton";
import { calculateSubscriptionMonthlyCost } from "../utils/calculations";
import { formatCurrency } from "../utils/formatters";
import { daysUntil } from "../utils/dateUtils";

export default function Subscriptions() {
  const { subscriptions, isLoading, deleteSubscription } = useFinance();
  const { settings } = useSettings();
  const currency = settings?.currency || "PKR";

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const monthlyCost = calculateSubscriptionMonthlyCost(subscriptions);
  const activeCount = subscriptions.filter((s) => s.status !== "cancelled").length;
  const upcoming = [...subscriptions]
    .filter((s) => daysUntil(s.nextBillingDate) >= 0)
    .sort((a, b) => new Date(a.nextBillingDate) - new Date(b.nextBillingDate))[0];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Subscriptions</h1>
          <p>Track recurring subscriptions and upcoming payments.</p>
        </div>
        <div className="page-header-actions">
          <Button icon={Plus} onClick={() => { setEditing(null); setModalOpen(true); }}>
            Add Subscription
          </Button>
        </div>
      </div>

      <div className="stat-grid">
        <Card>
          <span style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 600 }}>Active Subscriptions</span>
          <h2 style={{ fontSize: 24, marginTop: 6 }}>{activeCount}</h2>
        </Card>
        <Card>
          <span style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 600 }}>Monthly Estimated Cost</span>
          <h2 style={{ fontSize: 24, marginTop: 6 }}>{formatCurrency(monthlyCost, currency)}</h2>
        </Card>
        <Card>
          <span style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 600 }}>Next Payment</span>
          <h2 style={{ fontSize: 20, marginTop: 6 }}>{upcoming ? upcoming.name : "—"}</h2>
        </Card>
      </div>

      {isLoading ? (
        <div className="card-grid">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>
      ) : subscriptions.length === 0 ? (
        <EmptyState
          icon={RefreshCw}
          title="No subscriptions tracked yet"
          message="Add recurring subscriptions like Netflix or Spotify to monitor your monthly costs."
          actionLabel="Add Subscription"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="card-grid">
          {subscriptions.map((s) => (
            <SubscriptionCard
              key={s.id}
              subscription={s}
              currency={currency}
              onEdit={(sub) => { setEditing(sub); setModalOpen(true); }}
              onDelete={(sub) => setDeleteTarget(sub)}
            />
          ))}
        </div>
      )}

      <SubscriptionFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} initialData={editing} />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { deleteSubscription(deleteTarget.id); setDeleteTarget(null); }}
        title="Delete subscription?"
        message={`This will remove "${deleteTarget?.name}". This cannot be undone.`}
      />
    </div>
  );
}
