import { forwardRef } from "react";
import "./Input.css";

const Select = forwardRef(function Select(
  { label, error, hint, id, children, className = "", ...rest },
  ref
) {
  const selectId = id || rest.name;
  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={selectId} className="field-label">
          {label}
        </label>
      )}
      <select ref={ref} id={selectId} className={`field-select ${error ? "error" : ""}`} {...rest}>
        {children}
      </select>
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && (
        <span className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

export default Select;
