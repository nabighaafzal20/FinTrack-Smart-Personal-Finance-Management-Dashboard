import { Wallet, TrendingUp, ShieldCheck, PieChart } from "lucide-react";
import "./AuthLayout.css";

export default function AuthLayout({ children, subtitle }) {
  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-brand">
            <div className="brand-mark">
              <Wallet size={22} />
            </div>
            <span>FinTrack</span>
          </div>
          <h1>Take control of your money, effortlessly.</h1>
          <p>{subtitle || "Track spending, hit savings goals, and see your whole financial picture in one place."}</p>
          <div className="auth-feature-list">
            <div className="auth-feature">
              <TrendingUp size={18} />
              <span>Real-time budgets & analytics</span>
            </div>
            <div className="auth-feature">
              <PieChart size={18} />
              <span>Beautiful, dynamic reports</span>
            </div>
            <div className="auth-feature">
              <ShieldCheck size={18} />
              <span>Your data stays on your device</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-form-wrap">{children}</div>
      </div>
    </div>
  );
}
