import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import ImageUploader from "../../../components/ImageUploader";
import {
  createproduct,
  fetchproduct,
} from "../../../store/slice/product.Slice";
import { fetchCategories } from "../../../store/slice/category.slice";

const emptyVariation = () => ({
  name: "",
  pouches: "",
  mrp: "",
  price: "",
  stock: "",
  isActive: true,
});

const emptyProductForm = () => ({
  name: "",
  categoryId: "",
  category: "",
  brand: "Babaji Herbal",
  mrp: "",
  sellingPrice: "",
  discount: "",
  stock: "",
  shortDescription: "",
  status: "Active",
  availability: "In Stock",
  featured: false,
  images: [],
  variations: [],
});

const normaliseVariations = (variations) =>
  variations.map((variation) => ({
    name: variation.name.trim() || `${variation.pouches} pouches`,
    pouches: Number(variation.pouches),
    mrp: Number(variation.mrp),
    price: Number(variation.price),
    stock: Number(variation.stock) || 0,
    isActive: variation.isActive !== false,
  }));

const validateVariations = (variations) => {
  for (let index = 0; index < variations.length; index += 1) {
    const variation = variations[index];
    const label = `Variation ${index + 1}`;
    if (!Number(variation.pouches) || Number(variation.pouches) < 1) {
      return `${label}: enter the number of pouches.`;
    }
    if (variation.mrp === "" || Number(variation.mrp) < 0) {
      return `${label}: enter a valid MRP.`;
    }
    if (variation.price === "" || Number(variation.price) < 0) {
      return `${label}: enter a valid selling price.`;
    }
    if (variation.stock !== "" && Number(variation.stock) < 0) {
      return `${label}: stock cannot be negative.`;
    }
  }
  return "";
};

export default function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: categories = [] } = useSelector((state) => state.category);
  const [form, setForm] = useState(emptyProductForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchproduct());
  }, [dispatch]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateImages = (images) => {
    setForm((current) => ({ ...current, images }));
  };

  const selectCategory = (event) => {
    const selected = categories.find(
      (category) => category._id === event.target.value
    );
    setForm((current) => ({
      ...current,
      categoryId: selected?._id || "",
      category: selected?.name || "",
    }));
  };

  const updateVariation = (index, event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      variations: current.variations.map((variation, i) =>
        i === index
          ? { ...variation, [name]: type === "checkbox" ? checked : value }
          : variation
      ),
    }));
  };

  const addVariation = () =>
    setForm((current) => ({
      ...current,
      variations: [...current.variations, emptyVariation()],
    }));

  const removeVariation = (index) =>
    setForm((current) => ({
      ...current,
      variations: current.variations.filter((_, i) => i !== index),
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const variationError = validateVariations(form.variations);
    if (!form.categoryId || variationError) {
      setFormError(variationError || "Please select a category.");
      return;
    }
    const payload = {
      name: form.name,
      category: form.category,
      categoryId: form.categoryId,
      brand: form.brand,
      mrp: form.mrp,
      sellingPrice: form.sellingPrice,
      discount: form.discount,
      stock: form.stock,
      shortDescription: form.shortDescription,
      status: form.status,
      availability: form.availability,
      featured: form.featured,
      images: form.images,
      variations: normaliseVariations(form.variations),
    };
    setSaving(true);
    setFormError("");
    try {
      await dispatch(createproduct(payload)).unwrap();
      await dispatch(fetchCategories());
      navigate("/admin/products");
    } catch (requestError) {
      setFormError(requestError || "Product could not be added.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_12px_35px_rgba(37,99,235,0.08)]">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.28em] text-blue-600">
          Catalog
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Add Product</h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a product and its pouch-wise prices.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Product name
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              required
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Category
            <select
              value={form.categoryId}
              onChange={selectCategory}
              required
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">Select category</option>
              {categories
                .filter((category) => category.isActive)
                .map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Brand
            <input
              name="brand"
              value={form.brand}
              onChange={updateField}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Stock
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={updateField}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Default MRP
            <input
              name="mrp"
              type="number"
              min="0"
              value={form.mrp}
              onChange={updateField}
              required
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Default selling price
            <input
              name="sellingPrice"
              type="number"
              min="0"
              value={form.sellingPrice}
              onChange={updateField}
              required
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Discount (%)
            <input
              name="discount"
              type="number"
              min="0"
              value={form.discount}
              onChange={updateField}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Status
            <select
              name="status"
              value={form.status}
              onChange={updateField}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Availability
            <select
              name="availability"
              value={form.availability}
              onChange={updateField}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </label>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Product images
          </p>
          <ImageUploader
            value={form.images || []}
            onChange={updateImages}
            folder="products"
            multiple
            maxFiles={10}
            maxSizeMB={40}
            hint="Select multiple JPG, PNG, WEBP or GIF files. Their selected order is used in the product slider."
          />
        </div>

        <label className="block text-sm font-semibold text-slate-700">
          Short description
          <textarea
            name="shortDescription"
            value={form.shortDescription}
            onChange={updateField}
            rows="3"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
          />
        </label>

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">Pouch variations</h3>
              <p className="mt-1 text-sm text-slate-500">
                Add every pouch pack with its own price. Customers can select
                these options on the product page.
              </p>
            </div>
            <button
              type="button"
              onClick={addVariation}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={16} /> Add variation
            </button>
          </div>

          {form.variations.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-500">
              No variations added yet. The normal product price will be used.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {form.variations.map((variation, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-700">
                      Variation {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeVariation(index)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <label className="text-sm font-semibold text-slate-700">
                      Pouches
                      <input
                        name="pouches"
                        type="number"
                        min="1"
                        value={variation.pouches}
                        onChange={(e) => updateVariation(index, e)}
                        required
                        className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      MRP
                      <input
                        name="mrp"
                        type="number"
                        min="0"
                        value={variation.mrp}
                        onChange={(e) => updateVariation(index, e)}
                        required
                        className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      Selling price
                      <input
                        name="price"
                        type="number"
                        min="0"
                        value={variation.price}
                        onChange={(e) => updateVariation(index, e)}
                        required
                        className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      Variation stock
                      <input
                        name="stock"
                        type="number"
                        min="0"
                        value={variation.stock}
                        onChange={(e) => updateVariation(index, e)}
                        className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      Label (optional)
                      <input
                        name="name"
                        value={variation.name}
                        onChange={(e) => updateVariation(index, e)}
                        placeholder={`${variation.pouches || "28"} pouches`}
                        className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </label>
                  </div>
                  <label className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      name="isActive"
                      type="checkbox"
                      checked={variation.isActive}
                      onChange={(e) => updateVariation(index, e)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    Show this variation to customers
                  </label>
                </div>
              ))}
            </div>
          )}
        </section>

        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            name="featured"
            type="checkbox"
            checked={Boolean(form.featured)}
            onChange={updateField}
            className="h-4 w-4 accent-blue-600"
          />{" "}
          Featured product
        </label>

        {formError && (
          <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600">
            {formError}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="rounded-xl border border-blue-100 px-5 py-3 font-semibold text-slate-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </section>
  );
}
