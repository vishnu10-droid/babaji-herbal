import { useEffect } from "react";
import { ArrowRight, Leaf, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../store/slice/category.slice";
import { API_ORIGIN } from "../config/config";

export default function CategoryShowcase({ limit, categoryList }) {
  const dispatch = useDispatch();
  const { data: categories, loading, error } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const sourceCategories = categoryList || categories;
  const visibleCategories = sourceCategories
    .filter((category) => category.isActive)
    .slice(0, limit || sourceCategories.length);

  return (
    <section className="section-shell py-14">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
          <Leaf size={14} /> Shop by category
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold text-slate-900 md:text-5xl">Find Your Wellness Solution</h2>
        <p className="mt-3 text-slate-500">Explore herbal products organised around your health needs.</p>
      </div>

      {loading && <p className="text-center text-sm text-emerald-700">Loading categories...</p>}
      {error && <p className="text-center text-sm text-rose-600">{error}</p>}
      {!loading && !error && visibleCategories.length === 0 && (
        <p className="text-center text-sm text-slate-500">No active categories are available yet.</p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleCategories.map((category) => (
          <Link
            key={category._id}
            to={`/shop?category=${encodeURIComponent(category._id)}`}
            className="group relative flex min-h-72 flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
          >
            {category.image && (
              <img
                src={`${API_ORIGIN}${category.image}`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-[0.08] transition duration-500 group-hover:scale-105 group-hover:opacity-[0.13]"
              />
            )}
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                {category.image ? <img src={`${API_ORIGIN}${category.image}`} alt="" className="h-full w-full rounded-full object-cover" /> : <Leaf size={27} />}
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800">{category.productCount || 0}</span>
            </div>
            <div className="relative mt-5">
              <h3 className="text-xl font-bold text-slate-900">{category.name}</h3>
              <p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-500">{category.description || "Natural herbal products for your wellness."}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {category.productNames?.length ? category.productNames.map((name) => (
                  <li key={name} className="flex items-center gap-2"><Leaf size={13} className="shrink-0 text-emerald-600" /> <span className="truncate">{name}</span></li>
                )) : <li className="flex items-center gap-2 text-slate-500"><Package size={13} className="text-emerald-600" /> Products coming soon</li>}
              </ul>
            </div>
          <Link to={`/shop`}
  className="relative mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition-all duration-300 hover:bg-emerald-600 hover:text-white hover:shadow-md"
>
  Explore products
  <ArrowRight
    size={16}
    className="transition-transform duration-300 group-hover:translate-x-1"
  />
</Link>
          </Link>
        ))}
      </div>

      {limit && sourceCategories.filter((category) => category.isActive).length > limit && (
        <div className="mt-8 text-center"><Link to="/category" className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">View all categories <ArrowRight size={16} /></Link></div>
      )}
    </section>
  );
}
