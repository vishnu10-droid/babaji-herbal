import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import { API_ORIGIN } from "../../../config/config";
import { getHeroSlides, toggleHeroSlide } from "../../../service/heroSlide.api";

const resolveImage = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_ORIGIN}${image.startsWith("/") ? image : `/${image}`}`;
};

export default function BannerPage() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getHeroSlides();
      setSlides(data?.slides || []);
    } catch (e) {
      setError(e.response?.data?.message || "Could not load banners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (id) => {
    try {
      await toggleHeroSlide(id);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Could not update banner.");
    }
  };

  return (
    <AdminSectionPage
      title="Banner Manager"
      description="Homepage hero banners - enable, disable and manage placement."
      badge="Marketing"
      action={
        <Link
          to="/admin/hero-slides"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Manage Slides
        </Link>
      }
    >
      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}

      {loading ? (
        <p className="rounded-xl bg-white p-6 text-center text-sm text-slate-500">Loading banners...</p>
      ) : slides.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-sm font-semibold text-slate-700">No banners yet</p>
          <p className="mt-1 text-xs text-slate-500">Add hero slides to show banners on homepage.</p>
          <Link to="/admin/hero-slides" className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Add Banner
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {slides.map((slide) => (
            <div key={slide._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-40 bg-slate-100">
                {slide.image ? (
                  <img src={resolveImage(slide.image)} alt="Banner" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
                )}
                <span className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-bold ${slide.isActive ? "bg-emerald-500 text-white" : "bg-slate-700 text-white"}`}>
                  {slide.isActive ? "LIVE" : "HIDDEN"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3">
                <p className="text-xs font-semibold text-slate-700">Banner #{slide.sortOrder ?? 0}</p>
                <button
                  onClick={() => handleToggle(slide._id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${slide.isActive ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}
                >
                  {slide.isActive ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminSectionPage>
  );
}
