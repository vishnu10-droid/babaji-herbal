import { motion } from "framer-motion";
import { Eye, Pencil, Trash2 } from "lucide-react";

export function TableIconButton({ label, onClick, tone = "blue", children, ariaLabel }) {
  const tones = {
    blue: "text-blue-700 hover:bg-blue-50",
    rose: "text-rose-600 hover:bg-rose-50",
    emerald: "text-emerald-700 hover:bg-emerald-50",
    slate: "text-slate-600 hover:bg-slate-100",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={ariaLabel || label}
      className={`group relative rounded-lg p-2 transition ${tones[tone] || tones.blue}`}
    >
      {children}
      <span className="pointer-events-none absolute -top-8 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white shadow-lg group-hover:block">
        {label}
      </span>
    </button>
  );
}

export function TableActions({ onView, onEdit, onDelete, viewLabel = "View details", editLabel = "Edit", deleteLabel = "Delete", itemName = "" }) {
  return (
    <div className="flex items-center gap-1">
      {onView && (
        <TableIconButton label={viewLabel} ariaLabel={itemName ? `View ${itemName}` : viewLabel} onClick={onView} tone="emerald">
          <Eye size={17} />
        </TableIconButton>
      )}
      {onEdit && (
        <TableIconButton label={editLabel} ariaLabel={itemName ? `Edit ${itemName}` : editLabel} onClick={onEdit} tone="blue">
          <Pencil size={17} />
        </TableIconButton>
      )}
      {onDelete && (
        <TableIconButton label={deleteLabel} ariaLabel={itemName ? `Delete ${itemName}` : deleteLabel} onClick={onDelete} tone="rose">
          <Trash2 size={17} />
        </TableIconButton>
      )}
    </div>
  );
}

export default function AdminTable({
  columns,
  rows,
  emptyMessage = "No records found.",
}) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_14px_35px_rgba(15,61,42,0.07)]">
      <div className="w-full max-w-full overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f3f8f3] text-xs uppercase tracking-wider text-emerald-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-4 font-semibold ${
                    column.key === "actions"
                      ? "sticky right-0 z-10 whitespace-nowrap bg-[#f3f8f3]"
                      : ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length ? (
              rows.map((row, index) => (
                <motion.tr
                  key={row.id || row._id || index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="border-t border-emerald-50 text-slate-700 transition hover:bg-emerald-50/40"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-4 ${
                        column.key === "actions"
                          ? "sticky right-0 z-10 whitespace-nowrap bg-white"
                          : "max-w-[220px]"
                      }`}
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusBadge({ children, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        tones[tone] || tones.blue
      }`}
    >
      {children}
    </span>
  );
}
