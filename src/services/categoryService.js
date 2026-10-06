import { KEYS } from "./storageService";
import { makeUserScopedService } from "./makeUserScopedService";

const base = makeUserScopedService(KEYS.CATEGORIES, "cat");

export const DEFAULT_EXPENSE_CATEGORIES = [
  "Food", "Grocery", "Transport", "Rent", "Bills", "Shopping",
  "Education", "Healthcare", "Entertainment", "Travel", "Subscriptions", "Other",
];

export const DEFAULT_INCOME_CATEGORIES = [
  "Salary", "Freelancing", "Business", "Investment", "Bonus", "Gift", "Other",
];

const DEFAULT_ICON_MAP = {
  Food: "UtensilsCrossed", Grocery: "ShoppingCart", Transport: "Car", Rent: "Home",
  Bills: "Receipt", Shopping: "ShoppingBag", Education: "GraduationCap",
  Healthcare: "HeartPulse", Entertainment: "Clapperboard", Travel: "Plane",
  Subscriptions: "RefreshCw", Other: "MoreHorizontal", Salary: "Banknote",
  Freelancing: "Laptop", Business: "Briefcase", Investment: "TrendingUp",
  Bonus: "Gift", Gift: "Gift",
};

export function ensureDefaultCategories(userId) {
  const existing = base.getAll(userId);
  if (existing.length > 0) return existing;
  const created = [];
  DEFAULT_EXPENSE_CATEGORIES.forEach((name) => {
    created.push(
      base.create(userId, {
        name,
        type: "expense",
        icon: DEFAULT_ICON_MAP[name] || "Circle",
        isDefault: true,
      })
    );
  });
  DEFAULT_INCOME_CATEGORIES.forEach((name) => {
    created.push(
      base.create(userId, {
        name,
        type: "income",
        icon: DEFAULT_ICON_MAP[name] || "Circle",
        isDefault: true,
      })
    );
  });
  return created;
}

export const categoryService = {
  ...base,
  ensureDefaultCategories,
};
