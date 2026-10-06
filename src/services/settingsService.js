import { KEYS, getItem, setItem } from "./storageService";

const DEFAULT_SETTINGS = {
  currency: "PKR",
  notifications: {
    budgetAlerts: true,
    subscriptionAlerts: true,
    goalAlerts: true,
  },
};

export function getSettings(userId) {
  const all = getItem(KEYS.SETTINGS, {});
  return { ...DEFAULT_SETTINGS, ...(all[userId] || {}) };
}

export function updateSettings(userId, updates) {
  const all = getItem(KEYS.SETTINGS, {});
  all[userId] = { ...DEFAULT_SETTINGS, ...(all[userId] || {}), ...updates };
  setItem(KEYS.SETTINGS, all);
  return all[userId];
}
