import { useState } from "react";
import { useForm } from "react-hook-form";
import { Sun, Moon, Lock, LogOut, Trash2, Sparkles, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../hooks/useSettings";
import { useTheme } from "../hooks/useTheme";
import { useFinance } from "../hooks/useFinance";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import ConfirmModal from "../components/ui/ConfirmModal";
import { loadDemoData, clearDemoData, hasDemoData } from "../services/demoDataService";

const CURRENCIES = ["PKR", "USD", "EUR", "GBP", "AED", "SAR"];

export default function Settings() {
  const { user, changePassword, deleteAccount, logout } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { theme, setTheme } = useTheme();
  const { refreshAll } = useFinance();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const newPassword = watch("newPassword");

  const handleToggleNotif = (key) => {
    updateSettings({
      notifications: { ...settings.notifications, [key]: !settings.notifications[key] },
    });
  };

  const onChangePassword = async (data) => {
    setChangingPassword(true);
    try {
      await changePassword(data.newPassword);
      reset();
    } finally {
      setChangingPassword(false);
    }
  };

  const demoActive = hasDemoData(user?.id);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Customize your FinTrack experience.</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 640 }}>
        <Card>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Appearance</h3>
          <div className="theme-switch-row">
            <button className={`theme-option ${theme === "light" ? "active" : ""}`} onClick={() => setTheme("light")}>
              <Sun size={16} /> Light
            </button>
            <button className={`theme-option ${theme === "dark" ? "active" : ""}`} onClick={() => setTheme("dark")}>
              <Moon size={16} /> Dark
            </button>
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Currency</h3>
          <Select
            value={settings?.currency || "PKR"}
            onChange={(e) => updateSettings({ currency: e.target.value })}
            style={{ maxWidth: 220 }}
          >
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Notifications</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <ToggleRow
              label="Budget Alerts"
              checked={settings?.notifications?.budgetAlerts}
              onChange={() => handleToggleNotif("budgetAlerts")}
            />
            <ToggleRow
              label="Subscription Alerts"
              checked={settings?.notifications?.subscriptionAlerts}
              onChange={() => handleToggleNotif("subscriptionAlerts")}
            />
            <ToggleRow
              label="Goal Alerts"
              checked={settings?.notifications?.goalAlerts}
              onChange={() => handleToggleNotif("goalAlerts")}
            />
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>Demo Data</h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>
            Load sample transactions, budgets, and goals to explore FinTrack, or clear them anytime.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button variant="secondary" icon={Sparkles} onClick={() => { loadDemoData(user.id); refreshAll(); toast.success("Demo data loaded."); }}>
              Load Demo Data
            </Button>
            {demoActive && (
              <Button variant="outline-danger" icon={RotateCcw} onClick={() => { clearDemoData(user.id); refreshAll(); toast.success("Demo data cleared."); }}>
                Clear Demo Data
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>Change Password</h3>
          <form onSubmit={handleSubmit(onChangePassword)} style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 340 }}>
            <Input
              label="New Password"
              type="password"
              icon={Lock}
              error={errors.newPassword?.message}
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 8, message: "Must be at least 8 characters" },
              })}
            />
            <Input
              label="Confirm New Password"
              type="password"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (v) => v === newPassword || "Passwords do not match",
              })}
            />
            <Button type="submit" loading={changingPassword} style={{ alignSelf: "flex-start" }}>
              Update Password
            </Button>
          </form>
        </Card>

        <Card>
          <h3 style={{ fontSize: 15, marginBottom: 16, color: "var(--danger-500)" }}>Account</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button variant="secondary" icon={LogOut} onClick={logout}>Logout</Button>
            <Button variant="outline-danger" icon={Trash2} onClick={() => setConfirmDelete(true)}>Delete Account</Button>
          </div>
        </Card>
      </div>

      <ConfirmModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={deleteAccount}
        title="Delete your account?"
        message="This will permanently delete your account and all associated data (transactions, budgets, goals, subscriptions). This cannot be undone."
        confirmLabel="Delete Account"
      />
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</span>
      <button
        role="switch"
        aria-checked={!!checked}
        aria-label={label}
        className={`toggle-switch ${checked ? "on" : ""}`}
        onClick={onChange}
      >
        <span className="toggle-knob" />
      </button>
    </div>
  );
}
