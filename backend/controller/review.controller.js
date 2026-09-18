import mongoose from "mongoose";
import Review from "../model/review.js";
import Order from "../model/order.js";

const publicReview = (review) => ({
  _id: review._id,
  user: review.user,
  product: review.product,
  rating: review.rating,
  comment: review.comment || "",
  status: review.status,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
});

// POST /api/reviews  (login required)
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment = "" } = req.body;

    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Valid productId is required" });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Only customers who purchased the product can review it
    const purchased = await Order.findOne({
      user: req.user._id,
      "items.product": productId,
    }).select("_id");

    if (!purchased) {
      return res.status(403).json({ success: false, message: "You can only review products you have purchased" });
    }

    const review = await Review.findOneAndUpdate(
      { user: req.user._id, product: productId },
      { rating: numericRating, comment: String(comment).trim().slice(0, 1000), status: "Pending" },
      { new: true, upsert: true, runValidators: true },
    )
      .populate("user", "name")
      .populate("product", "name");

    return res.status(201).json({ success: true, message: "Review submitted for approval", review: publicReview(review) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reviews/my  (login required)
export const getMyReviews = async (_req, res) => {
  try {
    const reviews = await _req.user
      ? await Review.find({ user: _req.user._id })
          .populate("product", "name images sellingPrice mrp")
          .sort({ createdAt: -1 })
      : [];
    return res.json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reviews/product/:productId  (public - approved only)
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }
    const reviews = await Review.find({ product: productId, status: "Approved" })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    const total = reviews.length;
    const average = total ? Number((reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)) : 0;
    return res.json({ success: true, total, average, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/reviews/:id  (owner can delete own review)
export const deleteMyReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    await review.deleteOne();
    return res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
