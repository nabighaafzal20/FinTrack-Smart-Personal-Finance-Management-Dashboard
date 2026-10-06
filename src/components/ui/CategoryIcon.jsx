import { useFinance } from "../../hooks/useFinance";
import { getIcon } from "../../utils/iconMap";

export default function CategoryIcon({ category, type, size = 18, className = "" }) {
  const { categories } = useFinance();
  const match = categories.find((c) => c.name === category && (!type || c.type === type));
  const Icon = getIcon(match?.icon);
  return (
    <span className={`category-icon ${className}`}>
      <Icon size={size} />
    </span>
  );
}
