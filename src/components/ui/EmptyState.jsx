import Button from "./Button";
import "./EmptyState.css";

export default function EmptyState({ icon: Icon, title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state fade-in">
      {Icon && (
        <div className="empty-icon">
          <Icon size={26} />
        </div>
      )}
      <h4>{title}</h4>
      {message && <p>{message}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
