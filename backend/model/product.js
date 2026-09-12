import mongoose from "mongoose";

// ========================================
// PRODUCT VARIATION SCHEMA
// ========================================

const variationSchema = new mongoose.Schema(
  {
    // Example: "28 pouches"
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Example: 28
    pouches: {
      type: Number,
      required: true,
      min: 1,
    },

    // Original price
    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    // Actual selling price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Variation-specific stock
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Enable/disable individual variation
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  },
);

// ========================================
// PRODUCT SCHEMA
// ========================================

const productSchema = new mongoose.Schema(
  {
    // ========================================
    // BASIC INFORMATION
    // ========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    brand: {
      type: String,
      default: "Babaji Herbal",
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    ingredients: {
      type: String,
      default: "",
    },

    indications: {
      type: String,
      default: "",
    },

    dosage: {
      type: String,
      default: "",
    },

    // ========================================
    // DEFAULT PRODUCT PRICE
    // ========================================
    // These values are kept for products without
    // variations and for backward compatibility.

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ========================================
    // DEFAULT PRODUCT STOCK
    // ========================================

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    availability: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    // ========================================
    // PRODUCT IMAGES
    // ========================================
    //
    // New format:
    //   [
    //     { url: "https://ik.imagekit.io/...", fileId: "..." }
    //   ]
    //
    // Note: Mixed is used so already-existing
    // string entries (local /uploads paths)
    // continue to work during migration.

    images: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    // ========================================
    // PRODUCT VARIATIONS
    // ========================================

    variations: {
      type: [variationSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

export default Product;