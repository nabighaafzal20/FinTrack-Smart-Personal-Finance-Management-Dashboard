import { format } from "date-fns";

export function exportTransactionsToCSV(transactions, filenamePrefix = "fintrack-transactions") {
  const headers = ["Date", "Title", "Category", "Type", "Payment Method", "Amount", "Description"];
  const rows = transactions.map((t) => [
    t.date,
    t.title,
    t.category,
    t.type,
    t.paymentMethod,
    t.amount,
    (t.description || "").replace(/"/g, '""'),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "")}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateLabel = format(new Date(), "MMMM-yyyy").toLowerCase();
  link.href = url;
  link.download = `${filenamePrefix}-${dateLabel}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
