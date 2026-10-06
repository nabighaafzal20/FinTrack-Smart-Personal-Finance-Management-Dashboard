import { forwardRef } from "react";
import "./Input.css";

const Input = forwardRef(function Input(
  { label, error, icon: Icon, hint, id, className = "", ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      )}
      <div className={`field-input-wrap ${Icon ? "has-icon" : ""} ${error ? "has-error" : ""}`}>
        {Icon && <Icon size={16} className="field-icon" aria-hidden="true" />}
        <input ref={ref} id={inputId} className="field-input" {...rest} />
      </div>
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && (
        <span className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

export default Input;
