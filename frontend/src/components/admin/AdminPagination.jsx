import { ChevronLeft, ChevronRight } from "lucide-react";

// Admin theme pagination: currentPage 1-based
export default function AdminPagination({ currentPage, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const go = (page) => {
    const next = Math.min(Math.max(1, page), totalPages);
    if (next !== currentPage) onChange(next);
  };

  const pages = [];
  for (let p = 1; p <= totalPages; p += 1) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const btn =
    "flex h-8 min-w-8 items-center justify-center rounded-lg px-2.5 text-xs font-bold transition";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-1.5 py-3"
    >
      <button
        type="button"
        onClick={() => go(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btn} border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronLeft size={14} />
        Prev
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`gap-${i}`} className="px-1 text-xs text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={
              p === currentPage
                ? `${btn} bg-slate-900 text-white shadow`
                : `${btn} border border-slate-200 bg-white text-slate-600 hover:bg-slate-100`
            }
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => go(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btn} border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Next
        <ChevronRight size={14} />
      </button>
    </nav>
  );
}
