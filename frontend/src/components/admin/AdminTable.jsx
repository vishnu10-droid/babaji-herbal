import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import AdminPagination from "./AdminPagination";

/* =========================
   STATUS BADGE
========================= */
export function StatusBadge({ children, tone = "green" }) {
  const styles = {
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };

  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2 py-1 text-[9px] font-bold ${styles[tone] || styles.slate}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
          tone === "green"
            ? "bg-emerald-500"
            : tone === "rose"
            ? "bg-rose-500"
            : tone === "amber"
            ? "bg-amber-500"
            : tone === "blue"
            ? "bg-blue-500"
            : "bg-slate-400"
        }`}
      />
      {children}
    </span>
  );
}

/* =========================
   TABLE ACTIONS — always visible, never clipped
========================= */
export function TableActions({
  itemName = "item",
  viewLabel = "View",
  editLabel = "Edit",
  deleteLabel = "Delete",
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
      {onView && (
        <button
          type="button"
          onClick={onView}
          title={viewLabel}
          aria-label={`${viewLabel} ${itemName}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-px hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <Eye size={14} strokeWidth={2} />
        </button>
      )}

      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title={editLabel}
          aria-label={`${editLabel} ${itemName}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-px hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
        >
          <Pencil size={14} strokeWidth={2} />
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title={deleteLabel}
          aria-label={`${deleteLabel} ${itemName}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-px hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash2 size={14} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

/* =========================
   ADMIN TABLE — generic, responsive
========================= */
export default function AdminTable({
  columns = [],
  rows = [],
  emptyMessage = "No data found.",
  emptyHint = "Records will appear here once available.",
  title = "Records",
  subtitle = "Manage all records in one place",
  entityPlural = "records",
  pageSize = 10,
}) {
  const label = rows.length === 1 ? entityPlural.replace(/s$/, "") : entityPlural;

  // Pagination: ek baar me 10 rows
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [rows.length, pageSize]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRows = rows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );
  const rangeStart = rows.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, rows.length);

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* TABLE HEADER TOP */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-slate-800">{title}</h3>
          <p className="mt-0.5 truncate text-[10px] text-slate-400">{subtitle}</p>
        </div>

        <div className="shrink-0 rounded-full bg-slate-50 px-2.5 py-1 text-[9px] font-semibold text-slate-500">
          {rows.length} {label}
        </div>
      </div>

      {/* TABLE — horizontal scroll so Actions never breaks */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          {/* HEADER */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-3 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500 ${
                    column.key === "actions"
                      ? "sticky right-0 bg-slate-50 text-right shadow-[-8px_0_12px_-8px_rgba(0,0,0,0.12)]"
                      : "text-left"
                  } ${column.headerClassName || ""}`}
                  style={column.width ? { width: column.width, minWidth: column.minWidth } : undefined}
                >
                  <span
                    className={column.key === "actions" ? "inline-block" : "block truncate"}
                  >
                    {column.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="mx-auto flex max-w-xs flex-col items-center">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <Eye size={17} />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">{emptyMessage}</p>
                    <p className="mt-1 text-[10px] text-slate-400">{emptyHint}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rowIndex) => (
                <tr
                  key={row._id || row.id || rowIndex}
                  className="group border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50/70"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-3 py-2.5 align-middle ${
                        column.key === "actions"
                          ? "sticky right-0 bg-white shadow-[-8px_0_12px_-8px_rgba(0,0,0,0.12)] group-hover:bg-slate-50"
                          : ""
                      } ${column.cellClassName || ""}`}
                    >
                      <div className="min-w-0">
                        {column.render ? (
                          column.render(row)
                        ) : (
                          <span className="block truncate text-[11px] text-slate-600">
                            {row[column.key] ?? "—"}
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TABLE FOOTER */}
      {rows.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-slate-100 bg-slate-50/50 px-4 py-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600">
                {rangeStart}–{rangeEnd}
              </span>{" "}
              of <span className="font-semibold text-slate-600">{rows.length}</span>{" "}
              {label}
            </p>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
          <AdminPagination
            currentPage={safePage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
