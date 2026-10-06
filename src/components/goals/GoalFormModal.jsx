import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { useFinance } from "../../hooks/useFinance";
import { todayISO } from "../../utils/dateUtils";

const GOAL_TEMPLATES = ["Laptop", "Car", "Travel", "Emergency Fund", "Education", "Custom Goal"];

export default function GoalFormModal({ open, onClose, initialData = null }) {
  const { addGoal, updateGoal } = useFinance();
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      template: "Custom Goal",
      name: initialData?.name || "",
      targetAmount: initialData?.targetAmount || "",
      currentAmount: initialData?.currentAmount || 0,
      deadline: initialData?.deadline || "",
      description: initialData?.description || "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        template: "Custom Goal",
        name: initialData?.name || "",
        targetAmount: initialData?.targetAmount || "",
        currentAmount: initialData?.currentAmount || 0,
        deadline: initialData?.deadline || "",
        description: initialData?.description || "",
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = (data) => {
    const payload = {
      name: data.name.trim(),
      targetAmount: Number(data.targetAmount),
      currentAmount: Number(data.currentAmount) || 0,
      deadline: data.deadline || null,
      description: data.description?.trim() || "",
    };
    if (isEdit) updateGoal(initialData.id, payload);
    else addGoal(payload);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Goal" : "Create Financial Goal"} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {!isEdit && (
          <Select label="Goal Type" {...register("template")} onChange={(e) => {
            const val = e.target.value;
            if (val !== "Custom Goal") document.getElementById("goal-name").value = val;
          }}>
            {GOAL_TEMPLATES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        )}
        <Input
          id="goal-name"
          label="Goal Name"
          placeholder="e.g. New Laptop"
          error={errors.name?.message}
          {...register("name", { required: "Goal name is required" })}
        />
        <div className="form-row">
          <Input
            label="Target Amount"
            type="number"
            step="0.01"
            min="1"
            error={errors.targetAmount?.message}
            {...register("targetAmount", { required: "Target amount is required", min: { value: 1, message: "Must be greater than 0" } })}
          />
          <Input
            label="Current Saved Amount"
            type="number"
            step="0.01"
            min="0"
            {...register("currentAmount")}
          />
        </div>
        <Input label="Deadline (optional)" type="date" min={todayISO()} {...register("deadline")} />
        <Textarea label="Description (optional)" rows={2} {...register("description")} />
        <div className="modal-footer" style={{ padding: "10px 0 0", border: "none" }}>
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>Cancel</Button>
          <Button type="submit" loading={isSubmitting} fullWidth>{isEdit ? "Save Changes" : "Create Goal"}</Button>
        </div>
      </form>
    </Modal>
  );
}
