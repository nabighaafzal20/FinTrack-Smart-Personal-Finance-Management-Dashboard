import { Loader2 } from "lucide-react";
import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? "btn-full" : ""} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} className="btn-spinner" aria-hidden="true" />
      ) : (
        Icon && iconPosition === "left" && <Icon size={16} aria-hidden="true" />
      )}
      {children && <span>{children}</span>}
      {!loading && Icon && iconPosition === "right" && <Icon size={16} aria-hidden="true" />}
    </button>
  );
}
