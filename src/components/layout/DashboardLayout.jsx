import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./DashboardLayout.css";

const TITLES = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/budgets": "Budgets",
  "/goals": "Financial Goals",
  "/subscriptions": "Subscriptions",
  "/analytics": "Analytics & Reports",
  "/categories": "Categories",
  "/profile": "Profile",
  "/settings": "Settings",
};

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] || "FinTrack";

  return (
    <div className="dashboard-shell">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="dashboard-main">
        <Header title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="dashboard-content">
          <div className="container fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
