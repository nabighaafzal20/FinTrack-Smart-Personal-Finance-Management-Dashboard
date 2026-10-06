import { useState } from "react";
import "./Tooltip.css";

export default function Tooltip({ label, children, position = "top" }) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className="tooltip-wrap"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className={`tooltip-bubble tooltip-${position}`} role="tooltip">
          {label}
        </span>
      )}
    </span>
  );
}
