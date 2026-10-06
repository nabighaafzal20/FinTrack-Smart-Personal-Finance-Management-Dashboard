import { transactionService } from "./transactionService";
import { budgetService } from "./budgetService";
import { goalService } from "./goalService";
import { subscriptionService } from "./subscriptionService";
import { categoryService } from "./categoryService";
import { format, subDays, subMonths } from "date-fns";

const iso = (d) => format(d, "yyyy-MM-dd");
const today = new Date();

export function hasDemoData(userId) {
  return transactionService.getAll(userId).some((t) => t.isDemo);
}

export function loadDemoData(userId) {
  categoryService.ensureDefaultCategories(userId);

  const incomeData = [
    { title: "Monthly Salary", category: "Salary", amount: 150000, daysAgo: 2 },
    { title: "Freelance Project", category: "Freelancing", amount: 30000, daysAgo: 10 },
    { title: "Monthly Salary", category: "Salary", amount: 150000, daysAgo: 32 },
    { title: "Stock Dividend", category: "Investment", amount: 5000, daysAgo: 20 },
  ];

  const expenseData = [
    { title: "Grocery Shopping", category: "Grocery", amount: 8000, daysAgo: 1, method: "Debit Card" },
    { title: "Electricity Bill", category: "Bills", amount: 12000, daysAgo: 3, method: "Bank Transfer" },
    { title: "Dinner Out", category: "Food", amount: 3500, daysAgo: 4, method: "Cash" },
    { title: "Uber Rides", category: "Transport", amount: 4200, daysAgo: 5, method: "Digital Wallet" },
    { title: "Apartment Rent", category: "Rent", amount: 35000, daysAgo: 6, method: "Bank Transfer" },
    { title: "Netflix Subscription", category: "Subscriptions", amount: 1500, daysAgo: 7, method: "Credit Card" },
    { title: "New Shoes", category: "Shopping", amount: 6500, daysAgo: 12, method: "Credit Card" },
    { title: "Movie Night", category: "Entertainment", amount: 2200, daysAgo: 14, method: "Cash" },
    { title: "Doctor Visit", category: "Healthcare", amount: 3000, daysAgo: 18, method: "Cash" },
    { title: "Online Course", category: "Education", amount: 9000, daysAgo: 22, method: "Debit Card" },
    { title: "Grocery Shopping", category: "Grocery", amount: 7500, daysAgo: 25, method: "Debit Card" },
    { title: "Flight Tickets", category: "Travel", amount: 18000, daysAgo: 40, method: "Credit Card" },
    { title: "Gas Bill", category: "Bills", amount: 4500, daysAgo: 45, method: "Bank Transfer" },
    { title: "Coffee Shop", category: "Food", amount: 1200, daysAgo: 50, method: "Cash" },
  ];

  incomeData.forEach((item) => {
    transactionService.create(userId, {
      type: "income",
      title: item.title,
      category: item.category,
      amount: item.amount,
      date: iso(subDays(today, item.daysAgo)),
      paymentMethod: "Bank Transfer",
      description: "Demo data",
      isDemo: true,
    });
  });

  expenseData.forEach((item) => {
    transactionService.create(userId, {
      type: "expense",
      title: item.title,
      category: item.category,
      amount: item.amount,
      date: iso(subDays(today, item.daysAgo)),
      paymentMethod: item.method,
      description: "Demo data",
      isDemo: true,
    });
  });

  budgetService.create(userId, { category: "Food", amount: 15000, month: format(today, "yyyy-MM"), isDemo: true });
  budgetService.create(userId, { category: "Grocery", amount: 20000, month: format(today, "yyyy-MM"), isDemo: true });
  budgetService.create(userId, { category: "Bills", amount: 18000, month: format(today, "yyyy-MM"), isDemo: true });
  budgetService.create(userId, { category: "Entertainment", amount: 5000, month: format(today, "yyyy-MM"), isDemo: true });

  goalService.create(userId, {
    name: "New Laptop", targetAmount: 200000, currentAmount: 65000,
    deadline: iso(subMonths(today, -6)), description: "Saving for a new work laptop", isDemo: true,
  });
  goalService.create(userId, {
    name: "Emergency Fund", targetAmount: 300000, currentAmount: 120000,
    deadline: iso(subMonths(today, -12)), description: "6 months of expenses", isDemo: true,
  });

  subscriptionService.create(userId, {
    name: "Netflix", amount: 1500, billingCycle: "monthly",
    nextBillingDate: iso(subDays(today, -10)), category: "Entertainment", isDemo: true, status: "active",
  });
  subscriptionService.create(userId, {
    name: "Spotify", amount: 850, billingCycle: "monthly",
    nextBillingDate: iso(subDays(today, -18)), category: "Entertainment", isDemo: true, status: "active",
  });
  subscriptionService.create(userId, {
    name: "Adobe Creative Cloud", amount: 24000, billingCycle: "yearly",
    nextBillingDate: iso(subDays(today, -120)), category: "Subscriptions", isDemo: true, status: "active",
  });
}

export function clearDemoData(userId) {
  transactionService._saveAllRaw(
    transactionService._getAllRaw().filter((t) => !(t.userId === userId && t.isDemo))
  );
  budgetService._saveAllRaw(
    budgetService._getAllRaw().filter((b) => !(b.userId === userId && b.isDemo))
  );
  goalService._saveAllRaw(
    goalService._getAllRaw().filter((g) => !(g.userId === userId && g.isDemo))
  );
  subscriptionService._saveAllRaw(
    subscriptionService._getAllRaw().filter((s) => !(s.userId === userId && s.isDemo))
  );
}
