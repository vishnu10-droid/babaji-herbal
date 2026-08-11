import { useEffect } from "react";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../store/slice/category.slice";

export default function CategoriesPage() {
  const dispatch = useDispatch();

  const { data: categoryData } = useSelector(
    (state) => state.category
  );

  // console.log(categoryData);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <AdminSectionPage
      title="All Categories"
      description="Organize products under wellness-focused categories."
      badge="Structure"
    >
      <div className="grid gap-3 md:grid-cols-3">

        {categoryData?.data?.map((category) => (
          <div
            key={category._id}
            className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-white"
          >
            <h3 className="text-lg font-semibold">
              {category.name}
            </h3>

            <p className="mt-2 text-slate-400">
              {category.description}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              ID: {category._id}
            </p>
          </div>
        ))}

      </div>
    </AdminSectionPage>
  );
}