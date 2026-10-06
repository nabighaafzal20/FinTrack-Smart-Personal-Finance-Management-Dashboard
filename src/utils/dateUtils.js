import {
  format,
  parseISO,
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  startOfMonth,
  endOfMonth,
  subMonths,
  addWeeks,
  addMonths,
  addQuarters,
  addYears,
  isWithinInterval,
  isAfter,
  isBefore,
  differenceInCalendarDays,
} from "date-fns";

export function formatDate(dateStr, pattern = "MMM d, yyyy") {
  if (!dateStr) return "";
  try {
    return format(typeof dateStr === "string" ? parseISO(dateStr) : dateStr, pattern);
  } catch {
    return dateStr;
  }
}

export function todayISO() {
  return format(new Date(), "yyyy-MM-dd");
}

export function nowISO() {
  return new Date().toISOString();
}

export function matchesDateFilter(dateStr, filter, customRange) {
  if (!dateStr || filter === "all") return true;
  const d = parseISO(dateStr);
  switch (filter) {
    case "today":
      return isToday(d);
    case "week":
      return isThisWeek(d, { weekStartsOn: 1 });
    case "month":
      return isThisMonth(d);
    case "lastMonth": {
      const lastMonth = subMonths(new Date(), 1);
      return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
    }
    case "year":
      return isThisYear(d);
    case "custom":
      if (!customRange?.start || !customRange?.end) return true;
      return isWithinInterval(d, {
        start: parseISO(customRange.start),
        end: parseISO(customRange.end),
      });
    default:
      return true;
  }
}

export function getNextDueDate(startDate, frequency) {
  const base = typeof startDate === "string" ? parseISO(startDate) : startDate;
  switch (frequency) {
    case "weekly":
      return addWeeks(base, 1);
    case "monthly":
      return addMonths(base, 1);
    case "quarterly":
      return addQuarters(base, 1);
    case "yearly":
      return addYears(base, 1);
    default:
      return addMonths(base, 1);
  }
}

export function monthlyEquivalent(amount, cycle) {
  const amt = Number(amount) || 0;
  switch (cycle) {
    case "weekly":
      return (amt * 52) / 12;
    case "monthly":
      return amt;
    case "quarterly":
      return amt / 3;
    case "yearly":
      return amt / 12;
    default:
      return amt;
  }
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  return differenceInCalendarDays(parseISO(dateStr), new Date());
}

export function monthKey(dateStr) {
  return format(parseISO(dateStr), "yyyy-MM");
}

export function monthLabel(dateStr) {
  return format(parseISO(dateStr), "MMM");
}

export { startOfMonth, endOfMonth, subMonths, isAfter, isBefore, parseISO, format };
