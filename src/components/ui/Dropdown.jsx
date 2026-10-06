import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

export default function Dropdown({ trigger, children, align = "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div className={`dropdown-menu dropdown-${align}`} onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}
