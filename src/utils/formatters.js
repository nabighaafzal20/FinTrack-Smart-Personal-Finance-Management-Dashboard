const CURRENCY_LOCALE = {
  PKR: { locale: "en-PK", symbol: "Rs. " },
  USD: { locale: "en-US", symbol: "$" },
  EUR: { locale: "de-DE", symbol: "€" },
  GBP: { locale: "en-GB", symbol: "£" },
  AED: { locale: "ar-AE", symbol: "AED " },
  SAR: { locale: "ar-SA", symbol: "SAR " },
};

export function formatCurrency(amount, currency = "PKR") {
  const value = Number(amount) || 0;
  const cfg = CURRENCY_LOCALE[currency] || CURRENCY_LOCALE.PKR;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
  const sign = value < 0 ? "-" : "";
  return `${sign}${cfg.symbol}${formatted}`;
}

export function formatSignedCurrency(amount, type, currency = "PKR") {
  const prefix = type === "income" ? "+ " : "- ";
  return `${prefix}${formatCurrency(Math.abs(amount), currency)}`;
}

export function formatNumber(n) {
  return new Intl.NumberFormat("en-US").format(Number(n) || 0);
}

export function formatPercent(n) {
  const val = Number(n);
  if (!isFinite(val)) return "0%";
  return `${Math.round(val)}%`;
}

export function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
