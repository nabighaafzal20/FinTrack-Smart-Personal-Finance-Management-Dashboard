import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { useFinance } from "../../hooks/useFinance";
import { todayISO } from "../../utils/dateUtils";

export default function SubscriptionFormModal({ open, onClose, initialData = null }) {
  const { categories, addSubscription, updateSubscription } = useFinance();
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      amount: initialData?.amount || "",
      billingCycle: initialData?.billingCycle || "monthly",
      nextBillingDate: initialData?.nextBillingDate || todayISO(),
      category: initialData?.category || "Subscriptions",
      description: initialData?.description || "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name || "",
        amount: initialData?.amount || "",
        billingCycle: initialData?.billingCycle || "monthly",
        nextBillingDate: initialData?.nextBillingDate || todayISO(),
        category: initialData?.category || "Subscriptions",
        description: initialData?.description || "",
      });
    }
  }, [open, initialData, reset]);

  const expenseCategories = categories.filter((c) => c.type === "expense");

  const onSubmit = (data) => {
    const payload = {
      name: data.name.trim(),
      amount: Number(data.amount),
      billingCycle: data.billingCycle,
      nextBillingDate: data.nextBillingDate,
      category: data.category,
      description: data.description?.trim() || "",
      status: "active",
    };
    if (isEdit) updateSubscription(initialData.id, payload);
    else addSubscription(payload);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Subscription" : "Add Subscription"} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="Subscription Name" placeholder="e.g. Netflix" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
        <div className="form-row">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            error={errors.amount?.message}
            {...register("amount", { required: "Amount is required", min: { value: 0.01, message: "Must be greater than 0" } })}
          />
          <Select label="Billing Cycle" {...register("billingCycle")}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </Select>
        </div>
        <div className="form-row">
          <Input label="Next Billing Date" type="date" error={errors.nextBillingDate?.message} {...register("nextBillingDate", { required: "Required" })} />
          <Select label="Category" {...register("category")}>
            {expenseCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </Select>
        </div>
        <Textarea label="Description (optional)" rows={2} {...register("description")} />
        <div className="modal-footer" style={{ padding: "10px 0 0", border: "none" }}>
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>Cancel</Button>
          <Button type="submit" loading={isSubmitting} fullWidth>{isEdit ? "Save Changes" : "Add Subscription"}</Button>
        </div>
      </form>
    </Modal>
  );
}
