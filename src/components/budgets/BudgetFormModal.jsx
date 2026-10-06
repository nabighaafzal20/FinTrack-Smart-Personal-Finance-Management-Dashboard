import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { useFinance } from "../../hooks/useFinance";
import { monthKey } from "../../utils/dateUtils";

export default function BudgetFormModal({ open, onClose, initialData = null }) {
  const { categories, budgets, addBudget, updateBudget } = useFinance();
  const isEdit = !!initialData;
  const currentMonth = monthKey(new Date().toISOString());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      category: initialData?.category || "",
      amount: initialData?.amount || "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({ category: initialData?.category || "", amount: initialData?.amount || "" });
    }
  }, [open, initialData, reset]);

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const usedCategories = budgets
    .filter((b) => b.month === currentMonth && b.id !== initialData?.id)
    .map((b) => b.category);

  const onSubmit = (data) => {
    if (!isEdit && usedCategories.includes(data.category)) {
      toast.error("A budget for this category already exists this month.");
      return;
    }
    if (isEdit) {
      updateBudget(initialData.id, { category: data.category, amount: Number(data.amount) });
    } else {
      addBudget({ category: data.category, amount: Number(data.amount), month: currentMonth });
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Budget" : "Create Budget"} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Select label="Category" error={errors.category?.message} {...register("category", { required: "Category is required" })}>
          <option value="">Select category</option>
          {expenseCategories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </Select>
        <Input
          label="Monthly Budget Amount"
          type="number"
          step="0.01"
          min="1"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register("amount", {
            required: "Amount is required",
            min: { value: 1, message: "Amount must be greater than 0" },
          })}
        />
        <div className="modal-footer" style={{ padding: "10px 0 0", border: "none" }}>
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>Cancel</Button>
          <Button type="submit" loading={isSubmitting} fullWidth>{isEdit ? "Save Changes" : "Create Budget"}</Button>
        </div>
      </form>
    </Modal>
  );
}
