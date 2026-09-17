import React, { useEffect, useState } from "react";
import { Edit, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";

import {
  createHeroSlide,
  deleteHeroSlide,
  getHeroSlides,
  toggleHeroSlide,
  updateHeroSlide,
} from "../../../service/heroSlide.api";

import { API_ORIGIN } from "../../../config/config";

const resolveImage = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_ORIGIN}${image.startsWith("/") ? image : `/${image}`}`;
};

const emptyForm = {
  eyebrow: "",
  title: "",
  description: "",
  action: "",
  to: "/shop",
  position: "center",
  sortOrder: 0,
  isActive: true,
};

export default function HeroSlides() {
  const [slides, setSlides] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [modal, setModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  /* =========================
     FETCH
  ========================= */

  const getErrorMessage = (error, fallback) => {
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.response?.data?.error) return error.response.data.error;
    if (error?.response?.status === 404)
      return "API 404: Backend purana hai. Hero-slide wala code Render par deploy nahi hua. git push + Render redeploy karo, ya local backend chalao.";
    if (error?.code === "ERR_NETWORK" || error?.message?.includes("Network"))
      return "Backend se connect nahi ho paya. VITE_API_URL / CORS / server check karo.";
    if (error?.response?.status === 401)
      return "Admin login expire ho gaya. Dobara admin login karo.";
    if (error?.response?.status === 403)
      return "Access denied, admin only. Admin account se login karo.";
    if (error?.message) return error.message;
    return fallback;
  };

  const loadSlides = async () => {
    try {
      setLoading(true);

      const data = await getHeroSlides();

      setSlides(data?.slides || []);
    } catch (error) {
      console.error(error);

      alert(getErrorMessage(error, "Failed to load hero slides"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  /* =========================
     OPEN ADD
  ========================= */

  const openAdd = () => {
    setEditingId(null);

    setForm(emptyForm);

    setImage(null);

    setPreview("");

    setModal(true);
  };

  /* =========================
     OPEN EDIT
  ========================= */

  const openEdit = (slide) => {
    setEditingId(slide._id);

    setForm({
      eyebrow: slide.eyebrow || "",
      title: slide.title || "",
      description: slide.description || "",
      action: slide.action || "",
      to: slide.to || "/shop",
      position: slide.position || "center",
      sortOrder: slide.sortOrder || 0,
      isActive: slide.isActive ?? true,
    });

    setImage(null);

    setPreview(slide.image ? resolveImage(slide.image) : "");

    setModal(true);
  };

  /* =========================
     CLOSE
  ========================= */

  const closeModal = () => {
    if (saving) return;

    setModal(false);

    setEditingId(null);

    setForm(emptyForm);

    setImage(null);

    setPreview("");
  };

  /* =========================
     CHANGE
  ========================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================
     IMAGE
  ========================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowed.includes(file.type)) {
      alert("Only JPG, PNG, WEBP, GIF, AVIF allowed");
      return;
    }

    if (file.size > 40 * 1024 * 1024) {
      alert("File too large. Max 40MB allowed.");
      return;
    }

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId && !image) {
      alert("Please select hero image");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("eyebrow", form.eyebrow?.trim() || "");
      formData.append("title", form.title?.trim() || "");
      formData.append("description", form.description?.trim() || "");
      formData.append("action", form.action?.trim() || "");
      formData.append("to", form.to?.trim() || "/shop");
      formData.append("position", form.position || "center");
      formData.append("sortOrder", String(form.sortOrder ?? 0));
      formData.append("isActive", String(form.isActive));

      if (image) {
        formData.append("image", image);
      }

      if (editingId) {
        await updateHeroSlide(editingId, formData);
      } else {
        await createHeroSlide(formData);
      }

      await loadSlides();

      setModal(false);
      setEditingId(null);
      setForm(emptyForm);
      setImage(null);
      setPreview("");
    } catch (error) {
      console.error("Save hero slide error:", error);
      console.error("Response:", error?.response?.data);

      alert(getErrorMessage(error, "Something went wrong"));
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this slide?",
    );

    if (!confirmDelete) return;

    try {
      await deleteHeroSlide(id);

      await loadSlides();
    } catch (error) {
      console.error(error);

      alert(getErrorMessage(error, "Failed to delete slide"));
    }
  };

  /* =========================
     TOGGLE
  ========================= */

  const handleToggle = async (id) => {
    try {
      await toggleHeroSlide(id);

      await loadSlides();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to update status"));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Hero Slides</h1>

            <p className="mt-1 text-xs text-slate-500">
              Manage homepage hero slider
            </p>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={15} />
            Add Hero Slide
          </button>
        </div>

        {/* CONTENT */}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 className="animate-spin text-slate-500" size={25} />
          </div>
        ) : slides.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <ImagePlus className="mx-auto mb-3 text-slate-400" size={35} />

            <h2 className="text-sm font-semibold text-slate-700">
              No hero slides found
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Add your first homepage hero slide.
            </p>

            <button
              onClick={openAdd}
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
            >
              Add Slide
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {slides.map((slide) => (
              <div
                key={slide._id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                {/* IMAGE */}

                <div className="relative h-44 bg-slate-100">
                  <img
                    src={resolveImage(slide.image)}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: slide.position || "center",
                    }}
                  />

                  <div className="absolute left-2 top-2">
                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-bold ${
                        slide.isActive
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-700 text-white"
                      }`}
                    >
                      {slide.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>

                  <div className="absolute right-2 top-2">
                    <span className="rounded-full bg-black/60 px-2 py-1 text-[9px] font-bold text-white">
                      #{slide.sortOrder}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}

                <div className="p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                    {slide.eyebrow}
                  </p>

                  <h2 className="mt-1 line-clamp-2 text-sm font-bold text-slate-900">
                    {slide.title}
                  </h2>

                  <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">
                    {slide.description}
                  </p>

                  {/* ACTIONS */}

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => openEdit(slide)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[10px] font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Edit size={12} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleToggle(slide._id)}
                      className={`rounded-lg px-3 py-2 text-[10px] font-semibold ${
                        slide.isActive
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {slide.isActive ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => handleDelete(slide._id)}
                      className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================
          MODAL
      ========================= */}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {editingId ? "Edit Hero Slide" : "Add Hero Slide"}
                </h2>

                <p className="text-[9px] text-slate-500">
                  Add content and hero image
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X size={17} />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-3 p-4">
              {/* IMAGE */}

              <div>
                <label className="mb-1 block text-[10px] font-semibold text-slate-700">
                  Hero Image
                  {!editingId && <span className="text-red-500"> *</span>}
                </label>

                <label className="block cursor-pointer">
                  <div className="flex min-h-[180px] items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-[180px] w-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <ImagePlus
                          className="mx-auto text-slate-400"
                          size={30}
                        />

                        <p className="mt-2 text-xs font-semibold text-slate-600">
                          Choose hero image
                        </p>

                        <p className="mt-1 text-[9px] text-slate-400">
                          JPG, PNG, WEBP • Max 5MB
                        </p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* EYEBROW */}

              <div>
                <label className="mb-1 block text-[10px] font-semibold text-slate-700">
                  Eyebrow
                </label>

                <input
                  name="eyebrow"
                  value={form.eyebrow}
                  onChange={handleChange}
                  placeholder="Rooted in Ayurveda"
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              {/* TITLE */}

              <div>
                <label className="mb-1 block text-[10px] font-semibold text-slate-700">
                  Title
                </label>

                <textarea
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Everyday wellness, made naturally."
                  rows={2}
                  required
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-1 block text-[10px] font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Thoughtfully selected herbal remedies..."
                  rows={3}
                  required
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              {/* ACTION + LINK */}

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-semibold text-slate-700">
                    Button Text
                  </label>

                  <input
                    name="action"
                    value={form.action}
                    onChange={handleChange}
                    placeholder="Shop wellness"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-semibold text-slate-700">
                    Button Link
                  </label>

                  <input
                    name="to"
                    value={form.to}
                    onChange={handleChange}
                    placeholder="/shop"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* POSITION + SORT */}

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-semibold text-slate-700">
                    Image Position
                  </label>

                  <select
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="center">Center</option>

                    <option value="center top">Center Top</option>

                    <option value="center bottom">Center Bottom</option>

                    <option value="left center">Left</option>

                    <option value="right center">Right</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-semibold text-slate-700">
                    Sort Order
                  </label>

                  <input
                    type="number"
                    name="sortOrder"
                    value={form.sortOrder}
                    onChange={handleChange}
                    min="0"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* ACTIVE */}

              <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-slate-50 p-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 accent-emerald-600"
                />

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Active Slide
                  </p>

                  <p className="text-[9px] text-slate-500">
                    Show this slide on homepage
                  </p>
                </div>
              </label>

              {/* BUTTONS */}

              <div className="flex justify-end gap-2 border-t pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {saving && <Loader2 size={13} className="animate-spin" />}

                  {editingId ? "Update Slide" : "Add Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
