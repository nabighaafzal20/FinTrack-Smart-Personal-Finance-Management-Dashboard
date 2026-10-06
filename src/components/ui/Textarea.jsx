import { forwardRef } from "react";
import "./Input.css";

const Textarea = forwardRef(function Textarea(
  { label, error, hint, id, className = "", ...rest },
  ref
) {
  const areaId = id || rest.name;
  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={areaId} className="field-label">
          {label}
        </label>
      )}
      <textarea ref={ref} id={areaId} className={`field-textarea ${error ? "error" : ""}`} {...rest} />
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error" role="alert">{error}</span>}
    </div>
  );
});

export default Textarea;
