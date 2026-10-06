import { useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend,
} from "recharts";
import { Download } from "lucide-react";
import { useFinance } from "../hooks/useFinance";
import { useSettings } from "../hooks/useSettings";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import {
  calculateCategoryExpenses, calculateMonthlyExpenses, calculateTotalIncome,
  calculateTotalExpenses, calculateSavings, calculateSavingsRate,
  highestExpenseCategory, highestSpendingMonth, averageMonthlyExpense,
} from "../utils/calculations";
import { formatCurrency, formatPercent } from "../utils/formatters";
import { matchesDateFilter, todayISO } from "../utils/dateUtils";
import { exportTransactionsToCSV } from "../utils/csvExport";
import { BarChart3 } from "lucide-react";

const COLORS = ["#3d6bef", "#16a34a", "#d97706", "#e0384c", "#0ea5e9", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b", "#6366f1", "#84cc16", "#f43f5e"];

export default function Analytics() {
  const { transactions, isLoading } = useFinance();
  const { settings } = useSettings();
  const currency = settings?.currency || "PKR";

  const [range, setRange] = useState("month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => matchesDateFilter(t.date, range, { start: customStart, end: customEnd }));
  }, [transactions, range, customStart, customEnd]);

  const categoryData = useMemo(() => calculateCategoryExpenses(filteredTransactions, "expense"), [filteredTransactions]);
  const monthlyData = useMemo(() => calculateMonthlyExpenses(transactions, year), [transactions, year]);

  const summary = useMemo(() => ({
    income: calculateTotalIncome(filteredTransactions),
    expenses: calculateTotalExpenses(filteredTransactions),
    savings: calculateSavings(filteredTransactions),
    savingsRate: calculateSavingsRate(filteredTransactions),
    highestCategory: highestExpenseCategory(filteredTransactions),
    highestMonth: highestSpendingMonth(transactions),
    avgMonthlyExpense: averageMonthlyExpense(transactions),
  }), [filteredTransactions, transactions]);

  const availableYears = useMemo(() => {
    const years = new Set(transactions.map((t) => new Date(t.date).getFullYear()));
    years.add(new Date().getFullYear());
    return [...years].sort((a, b) => b - a);
  }, [transactions]);

  if (isLoading) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p>Insights generated from your real transaction data.</p>
        </div>
        <div className="page-header-actions">
          <Button variant="secondary" icon={Download} onClick={() => exportTransactionsToCSV(filteredTransactions, "fintrack-analytics")}>
            Export CSV
          </Button>
        </div>
      </div>

      <div className="filter-bar">
        <Select value={range} onChange={(e) => setRange(e.target.value)} aria-label="Report range">
          <option value="month">Current Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="year">Current Year</option>
          <option value="custom">Custom Range</option>
          <option value="all">All Time</option>
        </Select>
        {range === "custom" && (
          <div className="custom-range">
            <input type="date" value={customStart} max={todayISO()} onChange={(e) => setCustomStart(e.target.value)} />
            <span>to</span>
            <input type="date" value={customEnd} max={todayISO()} onChange={(e) => setCustomEnd(e.target.value)} />
          </div>
        )}
      </div>

      <div className="stat-grid">
        <SummaryStat label="Total Income" value={formatCurrency(summary.income, currency)} />
        <SummaryStat label="Total Expenses" value={formatCurrency(summary.expenses, currency)} />
        <SummaryStat label="Net Savings" value={formatCurrency(summary.savings, currency)} />
        <SummaryStat label="Savings Rate" value={formatPercent(summary.savingsRate)} />
        <SummaryStat label="Highest Expense Category" value={summary.highestCategory} />
        <SummaryStat label="Highest Spending Month" value={summary.highestMonth} />
        <SummaryStat label="Avg Monthly Expense" value={formatCurrency(summary.avgMonthlyExpense, currency)} />
      </div>

      <div className="two-col-grid">
        <Card>
          <div className="section-title-row"><h3>Expenses by Category</h3></div>
          {categoryData.length === 0 ? (
            <EmptyState icon={BarChart3} title="No expense data" message="Add expenses in this period to see the breakdown." />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="category" innerRadius={70} outerRadius={110} paddingAngle={2}>
                  {categoryData.map((entry, i) => <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <RTooltip formatter={(v) => formatCurrency(v, currency)} />
                <Legend verticalAlign="bottom" height={48} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <div className="section-title-row">
            <h3>Monthly Expenses</h3>
            <Select value={year} onChange={(e) => setYear(Number(e.target.value))} style={{ maxWidth: 110 }}>
              {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <RTooltip formatter={(v) => formatCurrency(v, currency)} />
              <Bar dataKey="expense" fill="#e0384c" radius={[6, 6, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <div className="section-title-row"><h3>Income vs Expenses vs Savings</h3></div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <RTooltip formatter={(v) => formatCurrency(v, currency)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2.5} dot={false} name="Income" />
            <Line type="monotone" dataKey="expense" stroke="#e0384c" strokeWidth={2.5} dot={false} name="Expenses" />
            <Line type="monotone" dataKey="savings" stroke="#3d6bef" strokeWidth={2.5} dot={false} name="Savings" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function SummaryStat({ label, value }) {
  return (
    <Card>
      <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{label}</span>
      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6, fontFamily: "var(--font-display)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {value}
      </div>
    </Card>
  );
}
