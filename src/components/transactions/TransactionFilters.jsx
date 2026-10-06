import SearchBar from "../ui/SearchBar";
import Select from "../ui/Select";
import "./TransactionFilters.css";

export default function TransactionFilters({ filters, setFilters, categories }) {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="filter-bar">
      <SearchBar value={filters.search} onChange={(v) => update("search", v)} placeholder="Search title, category, payment method..." />

      <Select value={filters.type} onChange={(e) => update("type", e.target.value)} aria-label="Filter by type">
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </Select>

      <Select value={filters.category} onChange={(e) => update("category", e.target.value)} aria-label="Filter by category">
        <option value="all">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </Select>

      <Select value={filters.date} onChange={(e) => update("date", e.target.value)} aria-label="Filter by date">
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="lastMonth">Last Month</option>
        <option value="year">This Year</option>
        <option value="custom">Custom Range</option>
      </Select>

      <Select value={filters.sort} onChange={(e) => update("sort", e.target.value)} aria-label="Sort by">
        <option value="date_desc">Newest First</option>
        <option value="date_asc">Oldest First</option>
        <option value="amount_desc">Amount: High to Low</option>
        <option value="amount_asc">Amount: Low to High</option>
      </Select>

      {filters.date === "custom" && (
        <div className="custom-range">
          <input type="date" value={filters.customStart} onChange={(e) => update("customStart", e.target.value)} aria-label="Start date" />
          <span>to</span>
          <input type="date" value={filters.customEnd} onChange={(e) => update("customEnd", e.target.value)} aria-label="End date" />
        </div>
      )}
    </div>
  );
}
