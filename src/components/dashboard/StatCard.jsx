import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import "./StatCard.css";

export default function StatCard({ icon: Icon, label, value, change, tone = "brand" }) {
  const isPositive = change !== undefined && change >= 0;
  return (
    <div className={`stat-card stat-${tone}`}>
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {change !== undefined && change !== null && !Number.isNaN(change) && (
          <span className={`stat-change ${isPositive ? "positive" : "negative"}`}>
            {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(change).toFixed(1)}% vs last month
          </span>
        )}
      </div>
    </div>
  );
}
