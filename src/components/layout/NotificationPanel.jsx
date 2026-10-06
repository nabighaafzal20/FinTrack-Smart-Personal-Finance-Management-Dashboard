import { Bell, Check, Trash2, PiggyBank, AlertTriangle, RefreshCw, Target, TrendingUp, PlusCircle } from "lucide-react";
import { useFinance } from "../../hooks/useFinance";
import { formatDate } from "../../utils/dateUtils";
import "./NotificationPanel.css";

const TYPE_ICON = {
  budget_warning: PiggyBank,
  budget_exceeded: AlertTriangle,
  upcoming_subscription: RefreshCw,
  upcoming_recurring: RefreshCw,
  goal_milestone: Target,
  new_income: TrendingUp,
  expense_added: PlusCircle,
};

export default function NotificationPanel() {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useFinance();

  return (
    <div className="notif-panel" onClick={(e) => e.stopPropagation()}>
      <div className="notif-header">
        <span>Notifications</span>
        {notifications.length > 0 && (
          <button className="notif-mark-all" onClick={markAllNotificationsRead}>
            Mark all read
          </button>
        )}
      </div>
      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">
            <Bell size={22} />
            <p>You're all caught up.</p>
          </div>
        ) : (
          notifications.slice(0, 20).map((n) => {
            const Icon = TYPE_ICON[n.type] || Bell;
            return (
              <div key={n.id} className={`notif-item ${!n.isRead ? "unread" : ""}`}>
                <div className="notif-icon">
                  <Icon size={15} />
                </div>
                <div className="notif-content">
                  <p className="notif-title">{n.title}</p>
                  <p className="notif-message">{n.message}</p>
                  <span className="notif-time">{formatDate(n.createdAt, "MMM d, h:mm a")}</span>
                </div>
                <div className="notif-actions">
                  {!n.isRead && (
                    <button onClick={() => markNotificationRead(n.id)} aria-label="Mark as read" title="Mark as read">
                      <Check size={13} />
                    </button>
                  )}
                  <button onClick={() => deleteNotification(n.id)} aria-label="Delete notification" title="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
