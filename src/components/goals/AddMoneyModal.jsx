import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useFinance } from "../../hooks/useFinance";

export default function AddMoneyModal({ open, onClose, goal }) {
  const { addMoneyToGoal } = useFinance();
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setSubmitting(true);
    addMoneyToGoal(goal.id, Number(amount));
    setSubmitting(false);
    setAmount("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Add Money to "${goal?.name}"`} size="sm">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input
          label="Amount to Add"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
        />
        <div className="modal-footer" style={{ padding: "10px 0 0", border: "none" }}>
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>Cancel</Button>
          <Button type="submit" loading={submitting} fullWidth>Add Funds</Button>
        </div>
      </form>
    </Modal>
  );
}
