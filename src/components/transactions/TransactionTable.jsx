import { Eye, Pencil, Trash2, Receipt as ReceiptIcon, RefreshCw } from "lucide-react";
import CategoryIcon from "../ui/CategoryIcon";
import Badge from "../ui/Badge";
import { formatSignedCurrency } from "../../utils/formatters";
import { formatDate } from "../../utils/dateUtils";
import "./TransactionTable.css";

export default function TransactionTable({ transactions, currency, onView, onEdit, onDelete, onViewReceipt }) {
  return (
    <div className="txn-table-wrap">
      <table className="txn-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Payment Method</th>
            <th>Type</th>
            <th style={{ textAlign: "right" }}>Amount</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td data-label="Date">{formatDate(t.date)}</td>
              <td data-label="Description">
                <div className="txn-desc-cell">
                  <CategoryIcon category={t.category} type={t.type} size={16} />
                  <span>
                    {t.title}
                    {t.isRecurring && <RefreshCw size={11} className="recurring-mark" />}
                  </span>
                </div>
              </td>
              <td data-label="Category">{t.category}</td>
              <td data-label="Payment Method">{t.paymentMethod}</td>
              <td data-label="Type">
                <Badge variant={t.type === "income" ? "success" : "danger"} size="sm">
                  {t.type === "income" ? "Income" : "Expense"}
                </Badge>
              </td>
              <td data-label="Amount" style={{ textAlign: "right" }}>
                <span className={`txn-amount ${t.type}`}>{formatSignedCurrency(t.amount, t.type, currency)}</span>
              </td>
              <td data-label="Actions">
                <div className="txn-row-actions">
                  {t.receipt && (
                    <button onClick={() => onViewReceipt(t)} aria-label="View receipt" title="View receipt">
                      <ReceiptIcon size={14} />
                    </button>
                  )}
                  <button onClick={() => onView(t)} aria-label="View transaction" title="View"><Eye size={14} /></button>
                  <button onClick={() => onEdit(t)} aria-label="Edit transaction" title="Edit"><Pencil size={14} /></button>
                  <button onClick={() => onDelete(t)} aria-label="Delete transaction" title="Delete" className="danger"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
