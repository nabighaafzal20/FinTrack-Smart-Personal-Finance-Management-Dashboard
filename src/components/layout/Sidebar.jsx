import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, ArrowLeftRight, PiggyBank, Target, RefreshCw,
  BarChart3, Tags, Settings, User, LogOut, Wallet, X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { initials } from "../../utils/formatters";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/budgets", label: "Budgets", icon: PiggyBank },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/subscriptions", label: "Subscriptions", icon: RefreshCw },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/categories", label: "Categories", icon: Tags },
];

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();

  return (
    <>
      {mobileOpen && <div className="sidebar-scrim" onClick={onCloseMobile} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">
            <Wallet size={20} />
          </div>
          <div className="brand-text">
            <span className="brand-title">FinTrack</span>
            <span className="brand-subtitle">Smart Finance Management</span>
          </div>
          <button className="sidebar-close-mobile" onClick={onCloseMobile} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={onCloseMobile}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav">
          <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onCloseMobile}>
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onCloseMobile}>
            <User size={18} />
            <span>Profile</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials(user?.name || "U")}</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name}</span>
              <span className="sidebar-user-email">{user?.email}</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={logout} aria-label="Logout">
            <LogOut size={17} />
          </button>
        </div>
      </aside>
    </>
  );
}
