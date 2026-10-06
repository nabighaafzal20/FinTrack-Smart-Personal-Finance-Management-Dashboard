export default function Card({ children, className = "", padded = true, ...rest }) {
  return (
    <div className={`ui-card ${padded ? "ui-card-padded" : ""} ${className}`} {...rest}>
      {children}
    </div>
  );
}
