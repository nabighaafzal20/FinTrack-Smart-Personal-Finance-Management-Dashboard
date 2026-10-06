// Central localStorage wrapper. All other services go through this.
// Keeps the app "backend-ready" - swap these functions for fetch() calls later.

export const KEYS = {
  USERS: "expenseTracker_users",
  CURRENT_USER: "expenseTracker_currentUser",
  TRANSACTIONS: "expenseTracker_transactions",
  BUDGETS: "expenseTracker_budgets",
  CATEGORIES: "expenseTracker_categories",
  GOALS: "expenseTracker_goals",
  SUBSCRIPTIONS: "expenseTracker_subscriptions",
  NOTIFICATIONS: "expenseTracker_notifications",
  SETTINGS: "expenseTracker_settings",
  THEME: "expenseTracker_theme",
};

export function getItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Corrupted localStorage data for key "${key}", resetting.`, err);
    localStorage.removeItem(key);
    return fallback;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Failed to write localStorage key "${key}"`, err);
    return false;
  }
}

export function removeItem(key) {
  localStorage.removeItem(key);
}

export function genId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}
