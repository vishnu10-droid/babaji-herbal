import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";

export default function AddCategoryPage() {
  
  return (
    <AdminSectionPage
      title="Add Category"
      description="Create a new category for your herbal inventory hierarchy."
      badge="Create"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Category Management
        </h2>

        <Link
          to="/admin/categories/add"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          <Plus size={18} />
          Add Category
        </Link>
      </div>

      {/* Content */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-300">
        Category form preview:
        <ul className="mt-3 list-disc pl-5 space-y-2">
          <li>Category Name</li>
          <li>Slug</li>
          <li>Parent Category</li>
          <li>Status</li>
          <li>Description</li>
          <li>Category Image</li>
        </ul>
      </div>
    </AdminSectionPage>
  );
}