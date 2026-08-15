import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },

    variationName: {
      type: String,
      default: "",
    },

    pouches: {
      type: Number,
      default: null,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    // Snapshot of price at the time of adding to cart
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    mrp: {
      type: Number,
      default: 0,
    },

    productName: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    _id: true,
  }
);

const cartSchema = new mongoose.Schema(
  {
    // If your project has login/authentication,
    // use userId here.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;