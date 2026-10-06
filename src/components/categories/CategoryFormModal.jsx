import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { useFinance } from "../../hooks/useFinance";
import { getIcon, CATEGORY_ICON_CHOICES } from "../../utils/iconMap";

export default function CategoryFormModal({ open, onClose, initialData = null, defaultType = "expense" }) {
  const { addCategory, updateCategory } = useFinance();
  const isEdit = !!initialData;
  const [selectedIcon, setSelectedIcon] = useState(initialData?.icon || "Circle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || defaultType,
    },
  });

  useEffect(() => {
    if (open) {
      setSelectedIcon(initialData?.icon || "Circle");
      reset({ name: initialData?.name || "", type: initialData?.type || defaultType });
    }
  }, [open, initialData, defaultType, reset]);

  const onSubmit = (data) => {
    const payload = { name: data.name.trim(), type: data.type, icon: selectedIcon };
    if (isEdit) updateCategory(initialData.id, payload);
    else addCategory(payload);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Category" : "Create Category"} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="Category Name" placeholder="e.g. Pet Care" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
        <Select label="Type" disabled={initialData?.isDefault} {...register("type")}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </Select>

        <div className="field">
          <label className="field-label">Icon</label>
          <div className="icon-picker">
            {CATEGORY_ICON_CHOICES.map((iconName) => {
              const Icon = getIcon(iconName);
              return (
                <button
                  type="button"
                  key={iconName}
                  className={`icon-choice ${selectedIcon === iconName ? "selected" : ""}`}
                  onClick={() => setSelectedIcon(iconName)}
                  aria-label={iconName}
                  title={iconName}
                >
                  <Icon size={17} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="modal-footer" style={{ padding: "10px 0 0", border: "none" }}>
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>Cancel</Button>
          <Button type="submit" loading={isSubmitting} fullWidth>{isEdit ? "Save Changes" : "Create Category"}</Button>
        </div>
      </form>
    </Modal>
  );
}
