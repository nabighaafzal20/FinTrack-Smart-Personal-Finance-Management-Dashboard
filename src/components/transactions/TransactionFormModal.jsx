import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { useFinance } from "../../hooks/useFinance";
import { todayISO, getNextDueDate, format } from "../../utils/dateUtils";
import "./TransactionForm.css";

const PAYMENT_METHODS = ["Cash", "Debit Card", "Credit Card", "Bank Transfer", "Digital Wallet", "Other"];
const MAX_RECEIPT_BYTES = 1.5 * 1024 * 1024; // ~1.5MB after base64 inflation guard

export default function TransactionFormModal({ open, onClose, type = "expense", initialData = null }) {
  const { categories, addTransaction, updateTransaction } = useFinance();
  const [receiptData, setReceiptData] = useState(initialData?.receipt || null);
  const [receiptWarning, setReceiptWarning] = useState("");
  const [txnType, setTxnType] = useState(initialData?.type || type);
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      amount: initialData?.amount || "",
      category: initialData?.category || "",
      date: initialData?.date || todayISO(),
      paymentMethod: initialData?.paymentMethod || "Cash",
      description: initialData?.description || "",
      isRecurring: initialData?.isRecurring || false,
      recurringFrequency: initialData?.recurringFrequency || "monthly",
    },
  });

  const isRecurring = watch("isRecurring");

  useEffect(() => {
    if (open) {
      setTxnType(initialData?.type || type);
      setReceiptData(initialData?.receipt || null);
      setReceiptWarning("");
      reset({
        title: initialData?.title || "",
        amount: initialData?.amount || "",
        category: initialData?.category || "",
        date: initialData?.date || todayISO(),
        paymentMethod: initialData?.paymentMethod || "Cash",
        description: initialData?.description || "",
        isRecurring: initialData?.isRecurring || false,
        recurringFrequency: initialData?.recurringFrequency || "monthly",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData, type]);

  const filteredCategories = categories.filter((c) => c.type === txnType);

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_RECEIPT_BYTES) {
      setReceiptWarning("This image is quite large. Please choose a smaller file (under ~1.5MB) for best performance.");
      return;
    }
    setReceiptWarning("");
    const reader = new FileReader();
    reader.onload = () => setReceiptData(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = (data) => {
    if (!data.category) {
      toast.error("Please select a category.");
      return;
    }
    const payload = {
      type: txnType,
      title: data.title.trim(),
      amount: Number(data.amount),
      category: data.category,
      date: data.date,
      paymentMethod: data.paymentMethod,
      description: data.description?.trim() || "",
      receipt: receiptData || null,
      isRecurring: !!data.isRecurring,
      recurringFrequency: data.isRecurring ? data.recurringFrequency : null,
      nextDueDate: data.isRecurring
        ? format(getNextDueDate(data.date, data.recurringFrequency), "yyyy-MM-dd")
        : null,
    };

    if (isEdit) {
      updateTransaction(initialData.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Transaction" : txnType === "income" ? "Add Income" : "Add Expense"}
      size="md"
    >
      <div className="type-toggle">
        <button
          type="button"
          className={txnType === "expense" ? "active expense" : ""}
          onClick={() => setTxnType("expense")}
        >
          Expense
        </button>
        <button
          type="button"
          className={txnType === "income" ? "active income" : ""}
          onClick={() => setTxnType("income")}
        >
          Income
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="txn-form">
        <Input
          label={txnType === "income" ? "Source / Title" : "Title"}
          placeholder={txnType === "income" ? "e.g. Monthly Salary" : "e.g. Grocery Shopping"}
          error={errors.title?.message}
          {...register("title", { required: "Title is required" })}
        />

        <div className="form-row">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register("amount", {
              required: "Amount is required",
              min: { value: 0.01, message: "Amount must be greater than 0" },
            })}
          />
          <Input
            label="Date"
            type="date"
            max={todayISO()}
            error={errors.date?.message}
            {...register("date", { required: "Date is required" })}
          />
        </div>

        <div className="form-row">
          <Select label="Category" error={errors.category?.message} {...register("category", { required: "Category is required" })}>
            <option value="">Select category</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </Select>
          <Select label="Payment Method" {...register("paymentMethod")}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </div>

        <Textarea label="Description (optional)" placeholder="Add a note..." rows={2} {...register("description")} />

        <div className="recurring-row">
          <label className="checkbox-label">
            <input type="checkbox" {...register("isRecurring")} />
            Mark as recurring
          </label>
          {isRecurring && (
            <Select {...register("recurringFrequency")} style={{ maxWidth: 160 }}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </Select>
          )}
        </div>

        <div className="field">
          <label className="field-label">Receipt (optional)</label>
          <input type="file" accept="image/*" onChange={handleReceiptChange} className="receipt-input" />
          {receiptWarning && <span className="field-error">{receiptWarning}</span>}
          {receiptData && (
            <div className="receipt-preview">
              <img src={receiptData} alt="Receipt preview" />
              <button type="button" onClick={() => setReceiptData(null)}>Remove</button>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ padding: "20px 0 0", border: "none" }}>
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting} fullWidth>
            {isEdit ? "Save Changes" : "Add " + (txnType === "income" ? "Income" : "Expense")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
