import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config/config";

export default function AddProductForm() {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    brand: "Babaji Herbal",
    shortDescription: "",
    description: "",
    ingredients: "",
    indications: "",
    dosage: "",
    mrp: "",
    sellingPrice: "",
    discount: "",
    stock: "",
    status: "Active",
    featured: false,
    availability: "In Stock",

    variations: [
      {
        size: "",
        price: "",
      },
    ],

    images: [],
  });

  const [loading, setLoading] = useState(false);

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = e.target;

    // IMAGE CHANGE
    if (type === "file") {
      const selectedFiles = Array.from(files || []);

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...selectedFiles],
      }));

      // Clear input so same file can be selected again
      e.target.value = "";

      return;
    }

    // NORMAL INPUT
    setProduct((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================================
  // REMOVE IMAGE
  // =========================================

  const removeImage = (indexToRemove) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  // =========================================
  // VARIATION CHANGE
  // =========================================

  const handleVariationChange = (
    index,
    field,
    value
  ) => {
    setProduct((prev) => {
      const updatedVariations = [
        ...prev.variations,
      ];

      updatedVariations[index] = {
        ...updatedVariations[index],
        [field]: value,
      };

      return {
        ...prev,
        variations: updatedVariations,
      };
    });
  };

  // =========================================
  // ADD VARIATION
  // =========================================

  const addVariation = () => {
    setProduct((prev) => ({
      ...prev,
      variations: [
        ...prev.variations,
        {
          size: "",
          price: "",
        },
      ],
    }));
  };

  // =========================================
  // REMOVE VARIATION
  // =========================================

  const removeVariation = (indexToRemove) => {
    setProduct((prev) => ({
      ...prev,
      variations: prev.variations.filter(
        (_, index) =>
          index !== indexToRemove
      ),
    }));
  };

  // =========================================
  // SUBMIT PRODUCT
  // =========================================

  const submitHandler = async (e) => {
    e.preventDefault();

    if (product.images.length === 0) {
      alert("Please select at least one product image.");
      return;
    }

    if (!product.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!product.category.trim()) {
      alert("Please enter category.");
      return;
    }

    if (!product.mrp) {
      alert("Please enter MRP.");
      return;
    }

    if (!product.sellingPrice) {
      alert("Please enter selling price.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      // =========================================
      // TEXT FIELDS
      // =========================================

      data.append(
        "name",
        product.name
      );

      data.append(
        "category",
        product.category
      );

      data.append(
        "brand",
        product.brand
      );

      data.append(
        "shortDescription",
        product.shortDescription
      );

      data.append(
        "description",
        product.description
      );

      data.append(
        "ingredients",
        product.ingredients
      );

      data.append(
        "indications",
        product.indications
      );

      data.append(
        "dosage",
        product.dosage
      );

      data.append(
        "mrp",
        product.mrp
      );

      data.append(
        "sellingPrice",
        product.sellingPrice
      );

      data.append(
        "discount",
        product.discount || 0
      );

      data.append(
        "stock",
        product.stock || 0
      );

      data.append(
        "availability",
        product.availability
      );

      data.append(
        "status",
        product.status
      );

      data.append(
        "featured",
        product.featured
      );

      // =========================================
      // VARIATIONS
      // =========================================

      const validVariations =
        product.variations
          .filter(
            (variation) =>
              variation.size.trim() !== ""
          )
          .map((variation) => ({
            size: variation.size,
            price: Number(
              variation.price || 0
            ),
          }));

      data.append(
        "variations",
        JSON.stringify(validVariations)
      );

      // =========================================
      // IMAGES
      // IMPORTANT:
      // Backend uses upload.array("images", 10)
      // so field name must be "images"
      // =========================================

      product.images.forEach((image) => {
        data.append(
          "images",
          image
        );
      });

      // =========================================
      // DEBUG
      // =========================================

      console.log(
        "Product images:",
        product.images
      );

      console.log(
        "FormData prepared successfully"
      );

      // =========================================
      // API REQUEST
      // =========================================

      const token = localStorage.getItem("auth_token");

      const res = await axios.post(
        `${API_URL}/products`,
        data,
        {
          headers: {
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
        }
      );

      console.log(
        "PRODUCT RESPONSE:",
        res.data
      );

      alert(
        "Product Added Successfully!"
      );

      // =========================================
      // RESET FORM
      // =========================================

      setProduct({
        name: "",
        category: "",
        brand: "Babaji Herbal",
        shortDescription: "",
        description: "",
        ingredients: "",
        indications: "",
        dosage: "",
        mrp: "",
        sellingPrice: "",
        discount: "",
        stock: "",
        status: "Active",
        featured: false,
        availability: "In Stock",

        variations: [
          {
            size: "",
            price: "",
          },
        ],

        images: [],
      });

      // Reset file input
      const fileInput =
        document.querySelector(
          'input[name="images"]'
        );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(
        "ADD PRODUCT ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="max-w-6xl mx-auto rounded-2xl bg-slate-900 p-8">

      <h2 className="text-3xl font-bold text-white mb-8">
        Add Product
      </h2>

      <form
        onSubmit={submitHandler}
        className="space-y-8"
      >

        {/* =====================================
            BASIC INFORMATION
        ===================================== */}

        <div className="grid md:grid-cols-2 gap-5">

          <input
            name="name"
            value={product.name}
            placeholder="Product Name"
            onChange={handleChange}
            required
            className="rounded-lg bg-slate-800 p-3 text-white"
          />

          <input
            name="category"
            value={product.category}
            placeholder="Category"
            onChange={handleChange}
            required
            className="rounded-lg bg-slate-800 p-3 text-white"
          />

          <input
            name="brand"
            value={product.brand}
            placeholder="Brand"
            onChange={handleChange}
            className="rounded-lg bg-slate-800 p-3 text-white"
          />

          <input
            name="stock"
            type="number"
            value={product.stock}
            placeholder="Stock"
            min="0"
            onChange={handleChange}
            className="rounded-lg bg-slate-800 p-3 text-white"
          />

        </div>

        {/* =====================================
            PRICING
        ===================================== */}

        <div className="grid md:grid-cols-3 gap-5">

          <input
            type="number"
            name="mrp"
            value={product.mrp}
            placeholder="MRP"
            min="0"
            onChange={handleChange}
            required
            className="rounded-lg bg-slate-800 p-3 text-white"
          />

          <input
            type="number"
            name="sellingPrice"
            value={product.sellingPrice}
            placeholder="Selling Price"
            min="0"
            onChange={handleChange}
            required
            className="rounded-lg bg-slate-800 p-3 text-white"
          />

          <input
            type="number"
            name="discount"
            value={product.discount}
            placeholder="Discount (%)"
            min="0"
            onChange={handleChange}
            className="rounded-lg bg-slate-800 p-3 text-white"
          />

        </div>

        {/* =====================================
            SHORT DESCRIPTION
        ===================================== */}

        <textarea
          rows="3"
          name="shortDescription"
          value={product.shortDescription}
          placeholder="Short Description"
          onChange={handleChange}
          className="w-full rounded-lg bg-slate-800 p-3 text-white"
        />

        {/* =====================================
            DESCRIPTION
        ===================================== */}

        <textarea
          rows="5"
          name="description"
          value={product.description}
          placeholder="Full Description"
          onChange={handleChange}
          className="w-full rounded-lg bg-slate-800 p-3 text-white"
        />

        {/* =====================================
            INGREDIENTS
        ===================================== */}

        <textarea
          rows="4"
          name="ingredients"
          value={product.ingredients}
          placeholder="Ingredients"
          onChange={handleChange}
          className="w-full rounded-lg bg-slate-800 p-3 text-white"
        />

        {/* =====================================
            INDICATIONS
        ===================================== */}

        <textarea
          rows="3"
          name="indications"
          value={product.indications}
          placeholder="Indications"
          onChange={handleChange}
          className="w-full rounded-lg bg-slate-800 p-3 text-white"
        />

        {/* =====================================
            DOSAGE
        ===================================== */}

        <textarea
          rows="2"
          name="dosage"
          value={product.dosage}
          placeholder="Dosage"
          onChange={handleChange}
          className="w-full rounded-lg bg-slate-800 p-3 text-white"
        />

        {/* =====================================
            IMAGES
        ===================================== */}

        <div>

          <label className="block text-white mb-2 font-semibold">
            Product Images
          </label>

          <input
            type="file"
            name="images"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleChange}
            className="w-full rounded-lg bg-slate-800 p-3 text-white"
          />

          {/* IMAGE PREVIEW */}

          {product.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5">

              {product.images.map(
                (image, index) => {

                  const previewUrl =
                    URL.createObjectURL(
                      image
                    );

                  return (
                    <div
                      key={`${image.name}-${index}`}
                      className="relative h-36 rounded-xl overflow-hidden bg-slate-800 border border-slate-700"
                    >

                      <img
                        src={previewUrl}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* REMOVE IMAGE */}

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(index)
                        }
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600 text-white font-bold hover:bg-red-700"
                      >
                        ×
                      </button>

                      {/* IMAGE NUMBER */}

                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Image {index + 1}
                      </span>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

        {/* =====================================
            VARIATIONS
        ===================================== */}

        <div>

          <div className="flex justify-between items-center mb-4">

            <h3 className="text-xl text-white font-semibold">
              Product Variations
            </h3>

            <button
              type="button"
              onClick={addVariation}
              className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
            >
              + Add Variation
            </button>

          </div>

          {product.variations.map(
            (variation, index) => (

              <div
                key={index}
                className="grid md:grid-cols-3 gap-4 mb-3"
              >

                <input
                  placeholder="Size / Packaging"
                  value={variation.size}
                  onChange={(e) =>
                    handleVariationChange(
                      index,
                      "size",
                      e.target.value
                    )
                  }
                  className="rounded-lg bg-slate-800 p-3 text-white"
                />

                <input
                  type="number"
                  placeholder="Price"
                  min="0"
                  value={variation.price}
                  onChange={(e) =>
                    handleVariationChange(
                      index,
                      "price",
                      e.target.value
                    )
                  }
                  className="rounded-lg bg-slate-800 p-3 text-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeVariation(index)
                  }
                  disabled={
                    product.variations
                      .length === 1
                  }
                  className="rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
                >
                  Remove
                </button>

              </div>
            )
          )}

        </div>

        {/* =====================================
            AVAILABILITY & STATUS
        ===================================== */}

        <div className="grid md:grid-cols-2 gap-5">

          <select
            name="availability"
            value={product.availability}
            onChange={handleChange}
            className="rounded-lg bg-slate-800 p-3 text-white"
          >
            <option value="In Stock">
              In Stock
            </option>

            <option value="Out of Stock">
              Out of Stock
            </option>
          </select>

          <select
            name="status"
            value={product.status}
            onChange={handleChange}
            className="rounded-lg bg-slate-800 p-3 text-white"
          >
            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>

        </div>

        {/* =====================================
            FEATURED
        ===================================== */}

        <label className="flex items-center gap-3 text-white cursor-pointer">

          <input
            type="checkbox"
            name="featured"
            checked={product.featured}
            onChange={handleChange}
            className="w-5 h-5"
          />

          <span>
            Featured Product
          </span>

        </label>

        {/* =====================================
            SUBMIT
        ===================================== */}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-8 py-3 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Saving..."
            : "Save Product"}
        </button>

      </form>
    </div>
  );
}
