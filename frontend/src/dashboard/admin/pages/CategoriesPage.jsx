import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable, { StatusBadge } from "../../../components/admin/AdminTable";
import ImageUploader from "../../../components/ImageUploader";
import {
  deleteCatgeorydata,
  fetchCategories,
  updateCategorydata,
} from "../../../store/slice/category.slice";
import { thumbnail } from "../../../utils/image";

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const { data: categories, loading, error } = useSelector((state) => state.category);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(null);
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const startEdit = (category) => {
    setActionError("");
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
      images: category.image ? [category.image] : [],
    });
  };

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const updateImages = (images) => {
    setForm((current) => ({ ...current, images }));
  };

  const saveCategory = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      isActive: form.isActive,
      image: form.images?.[0] || "",
    };

    setSaving(true);
    setActionError("");
    try {
      await dispatch(updateCategorydata({ id: editingCategory._id, data: payload })).unwrap();
      await dispatch(fetchCategories());
      setEditingCategory(null);
      setForm(null);
    } catch (requestError) {
      setActionError(requestError || "Category could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (category) => {
    if (!window.confirm(`Delete "${category.name}"?`)) return;

    setActionError("");
    try {
      await dispatch(deleteCatgeorydata(category._id)).unwrap();
    } catch (requestError) {
      setActionError(requestError || "Category could not be deleted.");
    }
  };

  const columns = [
    { key: "image", label: "Image", render: (category) => category.image ? <img src={thumbnail(category.image, 96)} alt={category.name} className="h-12 w-12 rounded-xl object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xs text-blue-600">N/A</div> },
    { key: "name", label: "Category", render: (category) => <span className="font-semibold text-slate-900">{category.name}</span> },
    { key: "description", label: "Description", render: (category) => <span className="block max-w-sm truncate text-slate-500">{category.description || "No description"}</span> },
    { key: "productCount", label: "Products", render: (category) => <span className="font-semibold text-slate-700">{category.productCount || 0}</span> },
    { key: "isActive", label: "Status", render: (category) => <StatusBadge tone={category.isActive ? "green" : "rose"}>{category.isActive ? "Active" : "Inactive"}</StatusBadge> },
    { key: "createdAt", label: "Created", render: (category) => new Date(category.createdAt).toLocaleDateString() },
    { key: "actions", label: "Actions", render: (category) => <div className="flex items-center gap-2"><button type="button" onClick={() => startEdit(category)} className="rounded-lg p-2 text-blue-700 transition hover:bg-blue-50" title="Edit category" aria-label={`Edit ${category.name}`}><Pencil size={17} /></button><button type="button" onClick={() => removeCategory(category)} className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50" title="Delete category" aria-label={`Delete ${category.name}`}><Trash2 size={17} /></button></div> },
  ];

  return <AdminSectionPage title="All Categories" description="Manage category images, descriptions, and visibility." badge="Structure" action={<Link to="/admin/categories/add" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">+ Add Category</Link>}>
    {actionError && <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{actionError}</p>}
    {loading && <p className="text-sm text-blue-600">Loading categories...</p>}
    {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
    {!loading && <AdminTable columns={columns} rows={categories} />}

    {editingCategory && form && <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4"><div className="mx-auto my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-900">Edit Category</h2><p className="mt-1 text-sm text-slate-500">Changes are reflected on the category cards.</p></div><button type="button" onClick={() => setEditingCategory(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close edit category"><X size={20} /></button></div><form onSubmit={saveCategory} className="space-y-5"><label className="block text-sm font-semibold text-slate-700">Category name<input name="name" value={form.name} onChange={updateField} required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500" /></label><label className="block text-sm font-semibold text-slate-700">Description<textarea name="description" value={form.description} onChange={updateField} rows="4" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500" /></label><div><p className="mb-2 text-sm font-semibold text-slate-700">Category image</p><ImageUploader value={form.images || []} onChange={updateImages} folder="categories" multiple={false} maxFiles={1} maxSizeMB={10} /></div><label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input name="isActive" type="checkbox" checked={Boolean(form.isActive)} onChange={updateField} className="h-4 w-4 accent-blue-600" /> Show this category in the store</label>{actionError && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{actionError}</p>}<div className="flex justify-end gap-3"><button type="button" onClick={() => setEditingCategory(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : "Save changes"}</button></div></form></div></div>}
  </AdminSectionPage>;
}