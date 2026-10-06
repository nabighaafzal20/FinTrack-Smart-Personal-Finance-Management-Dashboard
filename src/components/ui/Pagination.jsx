import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxButtons = 5;
  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      {start > 1 && (
        <>
          <button className="page-btn" onClick={() => onChange(1)}>1</button>
          {start > 2 && <span className="page-ellipsis">…</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          className={`page-btn ${p === page ? "active" : ""}`}
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="page-ellipsis">…</span>}
          <button className="page-btn" onClick={() => onChange(totalPages)}>{totalPages}</button>
        </>
      )}
      <button
        className="page-btn"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
