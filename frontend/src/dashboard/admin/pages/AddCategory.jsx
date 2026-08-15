import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../../store/slice/category.slice";

export default function AddCategory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.category);
  const [formData, setFormData] = useState({ name: "", description: "", image: null, isActive: true });
  const [preview, setPreview] = useState("");

  const updateField = (event) => {
    const { name, value, type, checked, files } = event.target;
    if (type === "file") {
      const file = files?.[0];
      setFormData((current) => ({ ...current, image: file }));
      setPreview(file ? URL.createObjectURL(file) : "");
      return;
    }
    setFormData((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("isActive", formData.isActive);
    if (formData.image) payload.append("image", formData.image);
    dispatch(createCategory(payload)).unwrap().then(() => navigate("/admin/categories"));
  };

  return <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_12px_35px_rgba(37,99,235,0.08)]">
    <div className="mb-6"><p className="text-xs uppercase tracking-[0.28em] text-blue-600">Structure</p><h1 className="mt-2 text-2xl font-bold text-slate-900">Add Category</h1><p className="mt-1 text-sm text-slate-500">Create a category with a clear image and description.</p></div>
    {error && <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <label className="flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-5 text-center">
        {preview ? <img src={preview} alt="Category preview" className="h-60 w-full rounded-xl object-cover" /> : <><div className="mb-3 text-4xl text-blue-500">＋</div><span className="font-semibold text-blue-700">Upload category image</span><span className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP up to 10MB</span></>}
        <input type="file" name="image" accept="image/*" onChange={updateField} className="hidden" />
      </label>
      <div className="space-y-5">
        <label className="block text-sm font-semibold text-slate-700">Category Name<input name="name" value={formData.name} onChange={updateField} required className="mt-2 w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label>
        <label className="block text-sm font-semibold text-slate-700">Description<textarea name="description" value={formData.description} onChange={updateField} rows="5" className="mt-2 w-full rounded-xl border border-blue-100 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label>
        <label className="flex items-center gap-3 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-slate-700"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={updateField} className="h-4 w-4 accent-blue-600" /> Show this category in the store</label>
        <div className="flex gap-3"><button type="button" onClick={() => navigate("/admin/categories")} className="rounded-xl border border-blue-100 px-5 py-3 font-semibold text-slate-600">Cancel</button><button type="submit" disabled={loading} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 disabled:opacity-60">{loading ? "Saving..." : "Save Category"}</button></div>
      </div>
    </form>
  </section>;
}
