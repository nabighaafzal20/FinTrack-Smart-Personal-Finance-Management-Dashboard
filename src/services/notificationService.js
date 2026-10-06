import { KEYS } from "./storageService";
import { makeUserScopedService } from "./makeUserScopedService";
import { nowISO } from "../utils/dateUtils";

const base = makeUserScopedService(KEYS.NOTIFICATIONS, "notif");

export const notificationService = {
  ...base,
  getAll(userId) {
    return base.getAll(userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  push(userId, { title, message, type }) {
    // Avoid duplicate unread notifications with the same title+type
    const existing = base.getAll(userId);
    const dup = existing.find(
      (n) => n.title === title && n.type === type && !n.isRead
    );
    if (dup) return dup;
    return base.create(userId, {
      title,
      message,
      type,
      isRead: false,
      createdAt: nowISO(),
    });
  },
  markAsRead(id) {
    return base.update(id, { isRead: true });
  },
  markAllAsRead(userId) {
    const items = base._getAllRaw();
    const updated = items.map((n) =>
      n.userId === userId ? { ...n, isRead: true } : n
    );
    base._saveAllRaw(updated);
  },
  unreadCount(userId) {
    return base.getAll(userId).filter((n) => !n.isRead).length;
  },
};
