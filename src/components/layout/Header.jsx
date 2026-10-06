import { useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, Bell, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { useFinance } from "../../hooks/useFinance";
import { initials } from "../../utils/formatters";
import Dropdown from "../ui/Dropdown";
import NotificationPanel from "./NotificationPanel";
import "./Header.css";

export default function Header({ title, onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useFinance();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <h2 className="header-title">{title}</h2>
      </div>

      <div className="header-right">
        <button className="header-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <Dropdown
          trigger={
            <button className="header-icon-btn" aria-label="Notifications">
              <Bell size={18} />
              {unreadCount > 0 && <span className="header-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>
          }
        >
          <NotificationPanel />
        </Dropdown>

        <Dropdown
          trigger={
            <button className="header-user-btn" aria-label="Account menu">
              <span className="header-avatar">{initials(user?.name || "U")}</span>
              <span className="header-user-name">{user?.name?.split(" ")[0]}</span>
            </button>
          }
        >
          <button className="dropdown-item" onClick={() => navigate("/profile")}>
            <User size={15} /> Profile
          </button>
          <button className="dropdown-item" onClick={() => navigate("/settings")}>
            <Settings size={15} /> Settings
          </button>
          <div className="dropdown-divider" />
          <button className="dropdown-item danger" onClick={logout}>
            <LogOut size={15} /> Logout
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
