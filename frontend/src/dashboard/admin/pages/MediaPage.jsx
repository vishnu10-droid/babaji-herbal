import { useEffect, useMemo, useState } from "react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminPagination from "../../../components/admin/AdminPagination";
import { API_ORIGIN } from "../../../config/config";
import { getMedia } from "../../../service/admin.api";

const resolveImage = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_ORIGIN}${image.startsWith("/") ? image : `/${image}`}`;
};

const sourceTone = {
  Product: "bg-emerald-500",
  "Hero Slide": "bg-blue-500",
  Category: "bg-violet-500",
};

export default function MediaPage() {
  const [media, setMedia] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getMedia()
      .then((data) => {
        setMedia(data.media || []);
        setCount(data.count || 0);
      })
      .catch((e) => setError(e.response?.data?.message || "Could not load media."))
      .finally(() => setLoading(false));
  }, []);

  const sources = ["All", ...new Set(media.map((m) => m.source))];
  const filtered = filter === "All" ? media : media.filter((m) => m.source === filter);

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, media.length]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedMedia = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  );

  return (
    <AdminSectionPage
      title="Media Gallery"
      description="All uploaded product photography and brand assets in one place."
      badge="Assets"
      action={
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">{count} files</span>
        </div>
      }
    >
      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}

      {loading ? (
        <p className="rounded-xl bg-white p-6 text-center text-sm text-slate-500">Loading media...</p>
      ) : media.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-sm font-semibold text-slate-700">No media yet</p>
          <p className="mt-1 text-xs text-slate-500">Images added to products, categories or hero slides will appear here.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {sources.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${filter === s ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {paginatedMedia.map((item, i) => (
              <a key={i} href={resolveImage(item.url)} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative h-36 bg-slate-100">
                  <img src={resolveImage(item.url)} alt={item.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                  <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${sourceTone[item.source] || "bg-slate-500"}`}>
                    {item.source}
                  </span>
                </div>
                <p className="truncate p-2 text-xs font-semibold text-slate-700">{item.name}</p>
              </a>
            ))}
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Showing {paginatedMedia.length} of {filtered.length} files · Page {safePage}/{totalPages}
          </p>
          <AdminPagination
            currentPage={safePage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
        </>
      )}
    </AdminSectionPage>
  );
}
