import { createContext, useState, useEffect, useCallback, useContext, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import { transactionService } from "../services/transactionService";
import { budgetService } from "../services/budgetService";
import { categoryService } from "../services/categoryService";
import { goalService } from "../services/goalService";
import { subscriptionService } from "../services/subscriptionService";
import { notificationService } from "../services/notificationService";
import { calculateBudgetUsage } from "../utils/calculations";
import { monthKey, daysUntil } from "../utils/dateUtils";
import { toast } from "sonner";

export const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAll = useCallback(() => {
    if (!user) {
      setTransactions([]);
      setBudgets([]);
      setCategories([]);
      setGoals([]);
      setSubscriptions([]);
      setNotifications([]);
      return;
    }
    setTransactions(transactionService.getAll(user.id));
    setBudgets(budgetService.getAll(user.id));
    setCategories(categoryService.getAll(user.id));
    setGoals(goalService.getAll(user.id));
    setSubscriptions(subscriptionService.getAll(user.id));
    setNotifications(notificationService.getAll(user.id));
  }, [user]);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => {
      refreshAll();
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [user, refreshAll]);

  // ---------- Transactions ----------
  const addTransaction = useCallback((data) => {
    if (!user) return;
    const created = transactionService.create(user.id, data);
    refreshAll();
    notificationService.push(user.id, {
      title: data.type === "income" ? "Income Added" : "Expense Added",
      message: `${data.title} - ${data.amount} was recorded.`,
      type: data.type === "income" ? "new_income" : "expense_added",
    });
    toast.success(`${data.type === "income" ? "Income" : "Expense"} added successfully.`);
    return created;
  }, [user, refreshAll]);

  const updateTransaction = useCallback((id, updates) => {
    transactionService.update(id, updates);
    refreshAll();
    toast.success("Transaction updated.");
  }, [refreshAll]);

  const deleteTransaction = useCallback((id) => {
    transactionService.delete(id);
    refreshAll();
    toast.success("Transaction deleted.");
  }, [refreshAll]);

  // ---------- Budgets ----------
  const addBudget = useCallback((data) => {
    if (!user) return;
    const created = budgetService.create(user.id, {
      month: monthKey(new Date().toISOString()),
      ...data,
    });
    refreshAll();
    toast.success("Budget created.");
    return created;
  }, [user, refreshAll]);

  const updateBudget = useCallback((id, updates) => {
    budgetService.update(id, updates);
    refreshAll();
    toast.success("Budget updated.");
  }, [refreshAll]);

  const deleteBudget = useCallback((id) => {
    budgetService.delete(id);
    refreshAll();
    toast.success("Budget deleted.");
  }, [refreshAll]);

  // ---------- Categories ----------
  const addCategory = useCallback((data) => {
    if (!user) return;
    const exists = categoryService
      .getAll(user.id)
      .some((c) => c.name.toLowerCase() === data.name.toLowerCase() && c.type === data.type);
    if (exists) {
      toast.error("A category with this name already exists.");
      return null;
    }
    const created = categoryService.create(user.id, data);
    refreshAll();
    toast.success("Category created.");
    return created;
  }, [user, refreshAll]);

  const updateCategory = useCallback((id, updates) => {
    categoryService.update(id, updates);
    refreshAll();
    toast.success("Category updated.");
  }, [refreshAll]);

  const deleteCategory = useCallback((id) => {
    categoryService.delete(id);
    refreshAll();
    toast.success("Category deleted.");
  }, [refreshAll]);

  // ---------- Goals ----------
  const addGoal = useCallback((data) => {
    if (!user) return;
    const created = goalService.create(user.id, { currentAmount: 0, ...data });
    refreshAll();
    toast.success("Goal created.");
    return created;
  }, [user, refreshAll]);

  const updateGoal = useCallback((id, updates) => {
    goalService.update(id, updates);
    refreshAll();
    toast.success("Goal updated.");
  }, [refreshAll]);

  const addMoneyToGoal = useCallback((id, amount) => {
    const goal = goalService.getById(id);
    if (!goal) return;
    const newAmount = Number(goal.currentAmount || 0) + Number(amount);
    goalService.update(id, { currentAmount: newAmount });
    refreshAll();
    if (newAmount >= goal.targetAmount) {
      notificationService.push(user.id, {
        title: "Goal Achieved! 🎉",
        message: `You've reached your goal "${goal.name}".`,
        type: "goal_milestone",
      });
    }
    toast.success("Funds added to goal.");
  }, [user, refreshAll]);

  const deleteGoal = useCallback((id) => {
    goalService.delete(id);
    refreshAll();
    toast.success("Goal deleted.");
  }, [refreshAll]);

  // ---------- Subscriptions ----------
  const addSubscription = useCallback((data) => {
    if (!user) return;
    const created = subscriptionService.create(user.id, { status: "active", ...data });
    refreshAll();
    toast.success("Subscription added.");
    return created;
  }, [user, refreshAll]);

  const updateSubscription = useCallback((id, updates) => {
    subscriptionService.update(id, updates);
    refreshAll();
    toast.success("Subscription updated.");
  }, [refreshAll]);

  const deleteSubscription = useCallback((id) => {
    subscriptionService.delete(id);
    refreshAll();
    toast.success("Subscription deleted.");
  }, [refreshAll]);

  // ---------- Notifications ----------
  const markNotificationRead = useCallback((id) => {
    notificationService.markAsRead(id);
    refreshAll();
  }, [refreshAll]);

  const markAllNotificationsRead = useCallback(() => {
    if (!user) return;
    notificationService.markAllAsRead(user.id);
    refreshAll();
  }, [user, refreshAll]);

  const deleteNotification = useCallback((id) => {
    notificationService.delete(id);
    refreshAll();
  }, [refreshAll]);

  // ---------- Budget alert watcher ----------
  useEffect(() => {
    if (!user || budgets.length === 0) return;
    budgets.forEach((budget) => {
      const { percentage } = calculateBudgetUsage(budget, transactions);
      if (percentage >= 100) {
        notificationService.push(user.id, {
          title: "Budget Exceeded",
          message: `You have exceeded your ${budget.category} budget.`,
          type: "budget_exceeded",
        });
      } else if (percentage >= 80) {
        notificationService.push(user.id, {
          title: "Budget Warning",
          message: `You have used 80% of your ${budget.category} budget.`,
          type: "budget_warning",
        });
      } else if (percentage >= 50) {
        notificationService.push(user.id, {
          title: "Budget Update",
          message: `50% of your ${budget.category} budget has been used.`,
          type: "budget_warning",
        });
      }
    });
    setNotifications(notificationService.getAll(user.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, budgets, user]);

  // ---------- Upcoming subscription/recurring watcher ----------
  useEffect(() => {
    if (!user || subscriptions.length === 0) return;
    subscriptions.forEach((sub) => {
      const days = daysUntil(sub.nextBillingDate);
      if (days !== null && days >= 0 && days <= 3) {
        notificationService.push(user.id, {
          title: "Upcoming Subscription Payment",
          message: `${sub.name} will be billed in ${days} day${days === 1 ? "" : "s"}.`,
          type: "upcoming_subscription",
        });
      }
    });
    setNotifications(notificationService.getAll(user.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptions, user]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  return (
    <FinanceContext.Provider
      value={{
        isLoading,
        transactions,
        budgets,
        categories,
        goals,
        subscriptions,
        notifications,
        unreadCount,
        refreshAll,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addCategory,
        updateCategory,
        deleteCategory,
        addGoal,
        updateGoal,
        addMoneyToGoal,
        deleteGoal,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}
