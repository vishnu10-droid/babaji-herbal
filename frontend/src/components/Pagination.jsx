import { ChevronLeft, ChevronRight } from "lucide-react";

// currentPage: 1-based, totalPages: number, onChange(page)
export default function Pagination({ currentPage, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const go = (page) => {
    const next = Math.min(Math.max(1, page), totalPages);
    if (next !== currentPage) onChange(next);
  };

  // Page numbers with ellipsis: 1 ... c-1 c c+1 ... last
  const pages = [];
  for (let p = 1; p <= totalPages; p += 1) {
    if (
      p === 1 ||
      p === totalPages ||
      Math.abs(p - currentPage) <= 1
    ) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const btn =
    "flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-bold transition";

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => go(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btn} border border-[#cfe1d0] bg-white text-[#174d32] hover:bg-[#edf4eb] disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-slate-400">
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
                ? `${btn} bg-[#174d32] text-white shadow`
                : `${btn} border border-[#cfe1d0] bg-white text-[#174d32] hover:bg-[#edf4eb]`
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
        className={`${btn} border border-[#cfe1d0] bg-white text-[#174d32] hover:bg-[#edf4eb] disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
