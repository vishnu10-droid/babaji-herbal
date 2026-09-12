import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../store/slice/category.slice";
import { fetchproduct } from "../store/slice/product.Slice";
import ProductCard from "../components/ProductCard";

export default function CategoryProducts() {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const { data: categories, loading: categoriesLoading } = useSelector(
    (state) => state.category,
  );
  const {
    data: products,
    loading,
    error,
  } = useSelector((state) => state.product);
  const category = useMemo(
    () => categories.find((item) => item._id === categoryId),
    [categories, categoryId],
  );

  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories());
  }, [categories.length, dispatch]);
  useEffect(() => {
    dispatch(fetchproduct({ categoryId }));
  }, [categoryId, dispatch]);

  return (
    <section className="section-shell py-12">
      <Link
        to="/category"
        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"
      >
        <ArrowLeft size={16} /> All categories
      </Link>
      <div className="mt-6 rounded-3xl bg-emerald-50 p-7 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-emerald-700">
          Category products
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          {category?.name || "Products"}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          {category?.description ||
            "Browse all products in this wellness category."}
        </p>
      </div>
      {(loading || categoriesLoading) && (
        <p className="py-12 text-center text-sm text-emerald-700">
          Loading products...
        </p>
      )}
      {error && (
        <p className="py-8 text-center text-sm text-rose-600">{error}</p>
      )}
      {!loading && !error && (
        <>
          <p className="mt-8 flex items-center gap-2 text-sm text-slate-500">
            <Package size={16} className="text-emerald-600" /> {products.length}{" "}
            product{products.length === 1 ? "" : "s"} found
          </p>
          {products.length ? (
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} item={product} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-emerald-200 p-10 text-center text-slate-500">
              No products have been added to this category yet.
            </div>
          )}
        </>
      )}
    </section>
  );
}
