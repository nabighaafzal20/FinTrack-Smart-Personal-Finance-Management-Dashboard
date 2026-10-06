import { Search, X } from "lucide-react";
import "./SearchBar.css";

export default function SearchBar({ value, onChange, placeholder = "Search...", className = "" }) {
  return (
    <div className={`search-bar ${className}`}>
      <Search size={16} className="search-icon" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange("")} aria-label="Clear search">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
