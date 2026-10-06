import { monthKey, monthLabel, monthlyEquivalent } from "./dateUtils";

export function calculateTotalIncome(transactions) {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

export function calculateTotalExpenses(transactions) {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

export function calculateBalance(transactions) {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
}

export function calculateSavings(transactions) {
  return calculateBalance(transactions);
}

export function calculateSavingsRate(transactions) {
  const income = calculateTotalIncome(transactions);
  if (income <= 0) return 0;
  const savings = calculateSavings(transactions);
  return (savings / income) * 100;
}

export function calculateCategoryExpenses(transactions, type = "expense") {
  const map = {};
  transactions
    .filter((t) => t.type === type)
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount || 0);
    });
  return Object.entries(map)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);
}

export function calculateMonthlyExpenses(transactions, year = new Date().getFullYear()) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const data = months.map((m) => ({ month: m, income: 0, expense: 0, savings: 0 }));
  transactions.forEach((t) => {
    const d = new Date(t.date);
    if (d.getFullYear() !== year) return;
    const idx = d.getMonth();
    if (t.type === "income") data[idx].income += Number(t.amount || 0);
    else data[idx].expense += Number(t.amount || 0);
  });
  data.forEach((d) => (d.savings = d.income - d.expense));
  return data;
}

export function calculateBudgetUsage(budget, transactions) {
  const used = transactions
    .filter((t) => t.type === "expense" && t.category === budget.category)
    .filter((t) => {
      if (!budget.month) return true;
      return monthKey(t.date) === budget.month;
    })
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const remaining = Number(budget.amount || 0) - used;
  const percentage = budget.amount > 0 ? (used / budget.amount) * 100 : 0;
  return { used, remaining, percentage };
}

export function calculateGoalProgress(goal) {
  const target = Number(goal.targetAmount || 0);
  const current = Number(goal.currentAmount || 0);
  if (target <= 0) return 0;
  return Math.min((current / target) * 100, 100);
}

export function calculateSubscriptionMonthlyCost(subscriptions) {
  return subscriptions
    .filter((s) => s.status !== "cancelled")
    .reduce((sum, s) => sum + monthlyEquivalent(s.amount, s.billingCycle), 0);
}

export function highestExpenseCategory(transactions) {
  const cats = calculateCategoryExpenses(transactions, "expense");
  return cats[0]?.category || "—";
}

export function highestSpendingMonth(transactions) {
  const map = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const key = monthKey(t.date);
      map[key] = (map[key] || 0) + Number(t.amount || 0);
    });
  const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return "—";
  const [key] = entries[0];
  const [y, m] = key.split("-");
  return monthLabel(`${y}-${m}-01`) + " " + y;
}

export function averageMonthlyExpense(transactions) {
  const map = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const key = monthKey(t.date);
      map[key] = (map[key] || 0) + Number(t.amount || 0);
    });
  const values = Object.values(map);
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
