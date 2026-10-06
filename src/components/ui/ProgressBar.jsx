import "./ProgressBar.css";

export default function ProgressBar({ value = 0, max = 100, variant, height = 8 }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  let tone = variant;
  if (!tone) {
    if (pct >= 100) tone = "danger";
    else if (pct >= 80) tone = "warning";
    else tone = "success";
  }
  return (
    <div className="progress-track" style={{ height }}>
      <div className={`progress-fill progress-${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
