import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import AdminSectionPage from "../../../components/admin/AdminSectionPage";
import AdminTable, { StatusBadge } from "../../../components/admin/AdminTable";
import ImageUploader from "../../../components/ImageUploader";
import {
  createproduct,
  deleteproduct,
  fetchproduct,
  updateproduct,
} from "../../../store/slice/product.Slice";
import { fetchCategories } from "../../../store/slice/category.slice";
import { thumbnail } from "../../../utils/image";

const editableFields = [
  "name",
  "brand",
  "mrp",
  "sellingPrice",
  "discount",
  "stock",
  "shortDescription",
  "status",
  "availability",
  "featured",
];

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

const toEditForm = (product) => ({
  ...editableFields.reduce(
    (form, field) => ({ ...form, [field]: product[field] ?? "" }),
    {},
  ),
  categoryId: product.categoryId || "",
  category: product.category || "",
  images: (product.images || []).map((image) =>
    typeof image === "string" ? image : image,
  ),
  variations: (product.variations || []).map((variation) => ({
    _id: variation._id,
    name: variation.name || "",
    pouches: variation.pouches ?? "",
    mrp: variation.mrp ?? "",
    price: variation.price ?? "",
    stock: variation.stock ?? "",
    isActive: variation.isActive !== false,
  })),
});

const normaliseVariations = (variations) =>
  variations.map((variation) => ({
    ...(variation._id ? { _id: variation._id } : {}),
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

function VariationFields({ variations, onChange, onAdd, onRemove }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">Pouch variations</h3>
          <p className="mt-1 text-sm text-slate-500">
            Add every pouch pack with its own price. Customers can select these
            options on the product page.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={16} /> Add variation
        </button>
      </div>

      {variations.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-500">
          No variations added yet. The normal product price will be used.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {variations.map((variation, index) => (
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
                  onClick={() => onRemove(index)}
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
                    onChange={(event) => onChange(index, event)}
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
                    onChange={(event) => onChange(index, event)}
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
                    onChange={(event) => onChange(index, event)}
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
                    onChange={(event) => onChange(index, event)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Label (optional)
                  <input
                    name="name"
                    value={variation.name}
                    onChange={(event) => onChange(index, event)}
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
                  onChange={(event) => onChange(index, event)}
                  className="h-4 w-4 accent-blue-600"
                />
                Show this variation to customers
              </label>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ProductForm({
  form,
  categories,
  onChange,
  onCategoryChange,
  onVariationChange,
  onAddVariation,
  onRemoveVariation,
  onImagesChange,
  submitLabel,
  saving,
  actionError,
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Product name
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            required
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Category
          <select
            value={form.categoryId}
            onChange={onCategoryChange}
            required
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
          >
            <option value="">Select category</option>
            {categories
              .filter(
                (category) =>
                  category.isActive || category._id === form.categoryId,
              )
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Status
          <select
            name="status"
            value={form.status}
            onChange={onChange}
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
            onChange={onChange}
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
          onChange={onImagesChange}
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
          onChange={onChange}
          rows="3"
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
        />
      </label>
      <VariationFields
        variations={form.variations}
        onChange={onVariationChange}
        onAdd={onAddVariation}
        onRemove={onRemoveVariation}
      />
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input
          name="featured"
          type="checkbox"
          checked={Boolean(form.featured)}
          onChange={onChange}
          className="h-4 w-4 accent-blue-600"
        />{" "}
        Featured product
      </label>
      {actionError && (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600">
          {actionError}
        </p>
      )}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </>
  );
}

export default function ProductsPage() {
  const dispatch = useDispatch();
  const {
    data: products,
    loading,
    error,
  } = useSelector((state) => state.product);
  const { data: categories } = useSelector((state) => state.category);
  const [addingProduct, setAddingProduct] = useState(false);
  const [addForm, setAddForm] = useState(emptyProductForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(null);
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchproduct());
    dispatch(fetchCategories());
  }, [dispatch]);

  const updateFormField = (setFormState) => (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateImages = (setFormState) => (images) => {
    setFormState((current) => ({ ...current, images }));
  };

  const updateVariation = (setFormState) => (index, event) => {
    const { name, value, type, checked } = event.target;
    setFormState((current) => ({
      ...current,
      variations: current.variations.map((variation, variationIndex) =>
        variationIndex === index
          ? { ...variation, [name]: type === "checkbox" ? checked : value }
          : variation,
      ),
    }));
  };

  const addVariation = (setFormState) => () =>
    setFormState((current) => ({
      ...current,
      variations: [...current.variations, emptyVariation()],
    }));
  const removeVariation = (setFormState) => (index) =>
    setFormState((current) => ({
      ...current,
      variations: current.variations.filter(
        (_, variationIndex) => variationIndex !== index,
      ),
    }));
  const selectCategory = (setFormState) => (event) => {
    const selected = categories.find(
      (category) => category._id === event.target.value,
    );
    setFormState((current) => ({
      ...current,
      categoryId: selected?._id || "",
      category: selected?.name || "",
    }));
  };

  const startEdit = (product) => {
    setActionError("");
    setEditingProduct(product);
    setForm(toEditForm(product));
  };

  const addProduct = async (event) => {
    event.preventDefault();
    const variationError = validateVariations(addForm.variations);
    if (!addForm.categoryId || variationError) {
      setActionError(variationError || "Please select a category.");
      return;
    }

    const payload = {
      name: addForm.name,
      category: addForm.category,
      categoryId: addForm.categoryId,
      brand: addForm.brand,
      mrp: addForm.mrp,
      sellingPrice: addForm.sellingPrice,
      discount: addForm.discount,
      stock: addForm.stock,
      shortDescription: addForm.shortDescription,
      status: addForm.status,
      availability: addForm.availability,
      featured: addForm.featured,
      images: addForm.images,
      variations: normaliseVariations(addForm.variations),
    };

    setSaving(true);
    setActionError("");
    try {
      await dispatch(createproduct(payload)).unwrap();
      await dispatch(fetchCategories());
      setAddingProduct(false);
      setAddForm(emptyProductForm());
    } catch (requestError) {
      setActionError(requestError || "Product could not be added.");
    } finally {
      setSaving(false);
    }
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    const variationError = validateVariations(form.variations);
    if (!form.categoryId || variationError) {
      setActionError(variationError || "Please select a category.");
      return;
    }

    setSaving(true);
    setActionError("");
    try {
      await dispatch(
        updateproduct({
          id: editingProduct._id,
          data: { ...form, variations: normaliseVariations(form.variations) },
        }),
      ).unwrap();
      await dispatch(fetchCategories());
      setEditingProduct(null);
      setForm(null);
    } catch (requestError) {
      setActionError(requestError || "Product could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`))
      return;
    setActionError("");
    try {
      await dispatch(deleteproduct(product._id)).unwrap();
      await dispatch(fetchCategories());
    } catch (requestError) {
      setActionError(requestError || "Product could not be deleted.");
    }
  };

  const columns = [
    {
      key: "image",
      label: "Product",
      render: (item) => (
        <div className="flex items-center gap-3">
          <img
            src={
              item.images?.[0]
                ? thumbnail(item.images[0], 96)
                : "https://placehold.co/48x48/eaf2ff/2563eb?text=P"
            }
            alt={item.name}
            className="h-12 w-12 rounded-xl object-cover"
          />
          <span className="font-semibold text-slate-900">{item.name}</span>
        </div>
      ),
    },
    { key: "category", label: "Category" },
    {
      key: "sellingPrice",
      label: "Price",
      render: (item) => `Rs. ${item.sellingPrice || 0}`,
    },
    {
      key: "stock",
      label: "Stock",
      render: (item) => (
        <span
          className={
            item.stock < 10 ? "font-semibold text-rose-600" : "text-slate-700"
          }
        >
          {item.stock || 0}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <StatusBadge tone={item.status === "Active" ? "green" : "rose"}>
          {item.status || "Draft"}
        </StatusBadge>
      ),
    },
    {
      key: "featured",
      label: "Featured",
      render: (item) =>
        item.featured ? (
          <StatusBadge>Yes</StatusBadge>
        ) : (
          <span className="text-slate-400">No</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => startEdit(item)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
            aria-label={`Edit ${item.name}`}
          >
            <Pencil size={15} /> Edit
          </button>
          <button
            type="button"
            onClick={() => removeProduct(item)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
            aria-label={`Delete ${item.name}`}
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminSectionPage
      title="All Products"
      description="Manage inventory, pricing, stock, and product visibility."
      badge="Catalog"
      action={
        <button
          type="button"
          onClick={() => {
            setActionError("");
            setAddForm(emptyProductForm());
            setAddingProduct(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          <Plus size={18} /> Add Product
        </button>
      }
    >
      {actionError && (
        <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
          {actionError}
        </p>
      )}
      {loading && <p className="text-sm text-blue-600">Loading products...</p>}
      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
          {error}
        </p>
      )}
      {!loading && <AdminTable columns={columns} rows={products} />}

      {addingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4">
          <div className="mx-auto my-8 w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add Product
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add a product and its pouch-wise prices.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddingProduct(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close add product"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={addProduct} className="space-y-5">
              <ProductForm
                form={addForm}
                categories={categories}
                onChange={updateFormField(setAddForm)}
                onCategoryChange={selectCategory(setAddForm)}
                onVariationChange={updateVariation(setAddForm)}
                onAddVariation={addVariation(setAddForm)}
                onRemoveVariation={removeVariation(setAddForm)}
                onImagesChange={updateImages(setAddForm)}
                submitLabel="Add product"
                saving={saving}
                actionError={actionError}
              />
            </form>
          </div>
        </div>
      )}

      {editingProduct && form && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4">
          <div className="mx-auto my-8 w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Product
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update pouch-wise prices and availability.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close edit product"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveProduct} className="space-y-5">
              <ProductForm
                form={form}
                categories={categories}
                onChange={updateFormField(setForm)}
                onCategoryChange={selectCategory(setForm)}
                onVariationChange={updateVariation(setForm)}
                onAddVariation={addVariation(setForm)}
                onRemoveVariation={removeVariation(setForm)}
                onImagesChange={updateImages(setForm)}
                submitLabel="Save changes"
                saving={saving}
                actionError={actionError}
              />
            </form>
          </div>
        </div>
      )}
    </AdminSectionPage>
  );
}
