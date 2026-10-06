# FinTrack — Smart Personal Finance Management

A frontend-only, production-quality personal finance dashboard built with React, Vite, and localStorage as a mock database.

## Features

- Mock authentication (register/login/forgot password) with SHA-256 password hashing, full per-user data isolation
- Dashboard with dynamically calculated balance, income, expenses, and savings rate
- Full transaction management: add/edit/delete, search, filter (type/category/date/amount), sort, pagination, receipt upload
- Category management with custom icons
- Budgets with automatic usage tracking and threshold notifications (50% / 80% / 100%)
- Financial goals with progress tracking and "add money" flow
- Subscription tracker with automatic monthly-cost calculation across billing cycles
- Analytics & Reports: category breakdown (pie), monthly expenses (bar), income vs. expense vs. savings (line) — all built with Recharts from real data
- CSV export of transactions
- Notification center (budget alerts, upcoming subscriptions, goal milestones, etc.)
- Light/Dark theme (persisted), multi-currency support (PKR/USD/EUR/GBP/AED/SAR)
- Fully responsive: sidebar → mobile drawer, tables → cards on small screens
- "Load Demo Data" option to explore the app quickly

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Tech Stack

React 19 · Vite · React Router DOM · React Hook Form · Recharts · Lucide React · date-fns · Sonner (toasts) · localStorage (mock database)

## Architecture Notes

- All localStorage access goes through `src/services/*Service.js` files (never directly from components), so it can be swapped for real REST calls later.
- `src/context/` holds `AuthContext`, `FinanceContext`, and `ThemeContext` (Context API for global state).
- `src/utils/calculations.js` contains every financial calculation (balance, savings rate, budget usage, goal progress, etc.) — nothing is hardcoded; everything derives from stored transactions.
- Every record (`transactions`, `budgets`, `categories`, `goals`, `subscriptions`, `notifications`) is scoped by `userId`, so User A can never see User B's data.

## Test Account Flow

1. Register a new account.
2. From the Dashboard, click "Load Demo Data" (only shown when you have no transactions) to see the app populated, or add your own income/expenses via Quick Actions.
3. Explore Budgets, Goals, Subscriptions, Analytics, and Settings — all values are calculated live from your data.
