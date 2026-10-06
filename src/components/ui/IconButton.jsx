import Tooltip from "./Tooltip";
import "./Button.css";

export default function IconButton({ icon: Icon, label, onClick, variant = "ghost", size = 16, className = "", ...rest }) {
  return (
    <Tooltip label={label}>
      <button
        type="button"
        className={`btn btn-icon btn-${variant} ${className}`}
        onClick={onClick}
        aria-label={label}
        {...rest}
      >
        <Icon size={size} aria-hidden="true" />
      </button>
    </Tooltip>
  );
}
