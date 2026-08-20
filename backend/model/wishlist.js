import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    // User who added the product to wishlist
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Product added to wishlist
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Same product ko same user wishlist me multiple times add na kar sake
wishlistSchema.index(
  { user: 1, product: 1 },
  { unique: true }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;