import * as Icons from "lucide-react";

export const CATEGORY_ICON_CHOICES = [
  "UtensilsCrossed", "ShoppingCart", "Car", "Home", "Receipt", "ShoppingBag",
  "GraduationCap", "HeartPulse", "Clapperboard", "Plane", "RefreshCw",
  "MoreHorizontal", "Banknote", "Laptop", "Briefcase", "TrendingUp", "Gift",
  "Coffee", "Dumbbell", "Music", "Gamepad2", "Fuel", "Wifi", "Phone",
  "PawPrint", "Baby", "Wrench", "Shirt", "Book", "Palette",
];

export function getIcon(name) {
  return Icons[name] || Icons.Circle;
}
