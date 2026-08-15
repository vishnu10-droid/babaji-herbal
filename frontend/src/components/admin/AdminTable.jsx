import { motion } from "framer-motion";

export default function AdminTable({
  columns,
  rows,
  emptyMessage = "No records found.",
}) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_12px_35px_rgba(37,99,235,0.08)]">
      <div className="w-full max-w-full overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-blue-50 text-xs uppercase tracking-wider text-blue-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-4 font-semibold ${
                    column.key === "actions"
                      ? "sticky right-0 z-10 whitespace-nowrap bg-blue-50"
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
                  className="border-t border-blue-50 text-slate-700 transition hover:bg-blue-50/50"
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