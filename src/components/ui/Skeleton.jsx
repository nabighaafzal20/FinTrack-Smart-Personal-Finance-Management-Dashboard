import "./Skeleton.css";

export function Skeleton({ width = "100%", height = 16, radius = 8, className = "" }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton width={38} height={38} radius={999} />
      <Skeleton width="60%" height={12} />
      <Skeleton width="40%" height={22} />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="skeleton-row">
      <Skeleton width={36} height={36} radius={999} />
      <Skeleton width="30%" height={12} />
      <Skeleton width="15%" height={12} />
      <Skeleton width="15%" height={12} />
    </div>
  );
}
