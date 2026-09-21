import React, { useEffect, useMemo, useState } from "react";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import AdminPagination from "../../../components/admin/AdminPagination";

import {
  createHeroSlide,
  deleteHeroSlide,
  getHeroSlides,
  toggleHeroSlide,
  updateHeroSlide,
} from "../../../service/heroSlide.api";
import { fetchproduct } from "../../../service/product.api";

import { API_ORIGIN } from "../../../config/config";

const resolveImage = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_ORIGIN}${image.startsWith("/") ? image : `/${image}`}`;
};

export default function HeroSlides() {
  const [slides, setSlides] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [modal, setModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [products, setProducts] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(slides.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedSlides = useMemo(
    () => slides.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [slides, safePage]
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [slides.length]);

  const getLinkedProductId = (slide) => {
    if (!slide) return "";
    if (slide.productId) {
      if (typeof slide.productId === "string") return slide.productId;
      if (typeof slide.productId === "object" && slide.productId._id)
        return slide.productId._id;
    }
    if (typeof slide.to === "string" && slide.to.startsWith("/product/")) {
      return slide.to.replace("/product/", "").trim();
    }
    return "";
  };

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
    const loadProducts = async () => {
      try {
        const data = await fetchproduct();
        const list = Array.isArray(data) ? data : data?.products || [];
        setProducts(list);
      } catch (e) {
        console.error("Products load error:", e);
      }
    };
    loadProducts();
  }, []);

  /* =========================
     OPEN ADD
  ========================= */

  const openAdd = () => {
    setEditingId(null);

    setImage(null);

    setPreview("");

    setSelectedProductId("");

    setModal(true);
  };

  /* =========================
     OPEN EDIT (image + product link)
  ========================= */

  const openEdit = (slide) => {
    setEditingId(slide._id);

    setImage(null);

    setPreview(slide.image ? resolveImage(slide.image) : "");

    setSelectedProductId(getLinkedProductId(slide));

    setModal(true);
  };

  /* =========================
     CLOSE
  ========================= */

  const closeModal = () => {
    if (saving) return;

    setModal(false);

    setEditingId(null);

    setImage(null);

    setPreview("");

    setSelectedProductId("");
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
     SUBMIT (image + product link)
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

      // Backend compatibility ke liye default text values
      formData.append("eyebrow", "");
      formData.append("title", "");
      formData.append("description", "");
      formData.append("action", "");
      formData.append("position", "center");
      formData.append("sortOrder", "0");
      formData.append("isActive", "true");

      // Banner click par product khulega
      formData.append("productId", selectedProductId || "");
      formData.append(
        "to",
        selectedProductId ? `/product/${selectedProductId}` : "/shop",
      );

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
      setImage(null);
      setPreview("");
      setSelectedProductId("");
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
          <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedSlides.map((slide) => (
              <div
                key={slide._id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                {/* IMAGE */}

                <div className="relative h-44 bg-slate-100">
                  <img
                    src={resolveImage(slide.image)}
                    alt="Hero slide"
                    className="h-full w-full object-cover"
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
                </div>

                {/* ACTIONS */}

                <div className="px-3 pt-2">
                  <p className="truncate text-[10px] text-slate-500">
                    {slide.productId?.name
                      ? `Linked: ${slide.productId.name}`
                      : getLinkedProductId(slide)
                        ? `Linked: /product/${getLinkedProductId(slide)}`
                        : "No product linked (click -> /shop)"}
                  </p>
                </div>

                <div className="flex items-center gap-2 p-3 pt-1">
                  <button
                    onClick={() => openEdit(slide)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[10px] font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Edit / Link Product
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
            ))}
          </div>
          <AdminPagination
            currentPage={safePage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
          </>
        )}
      </div>

      {/* =========================
          MODAL - IMAGE + PRODUCT LINK
      ========================= */}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="w-full max-w-md overflow-y-auto rounded-xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b bg-white px-4 py-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {editingId ? "Edit Banner" : "Add Banner"}
                </h2>

                <p className="text-[9px] text-slate-500">
                  Image + click par khulne wala product select karo
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
                          Best size: 1920 x 800px (landscape) • JPG, PNG, WEBP • Max 40MB
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

              {/* PRODUCT LINK */}

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Click par kaun sa product khulega?
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-slate-900"
                >
                  <option value="">No link (click -&gt; Shop page)</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} {p.sellingPrice ? `- ₹${p.sellingPrice}` : ""}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-slate-500">
                  Banner par jo product ki image hai, wahi product yahan
                  select karo. Customer banner click karega to wahi product
                  open hoga.
                </p>
              </div>

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

                  {editingId ? "Update Banner" : "Add Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
