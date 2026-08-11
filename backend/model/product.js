import mongoose from "mongoose";

const variationSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
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

    mrp: {
      type: Number,
      required: true,
    },

    sellingPrice: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
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

    // Product Images
    images: [
      {
        type: String,
      },
    ],

    variations: [variationSchema],
  },

  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;