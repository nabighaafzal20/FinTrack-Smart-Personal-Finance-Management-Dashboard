import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute, { PublicOnlyRoute } from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Budgets from "../pages/Budgets";
import Goals from "../pages/Goals";
import Subscriptions from "../pages/Subscriptions";
import Analytics from "../pages/Analytics";
import Categories from "../pages/Categories";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
