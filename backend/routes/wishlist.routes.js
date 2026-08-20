import express from "express";

import {
  addToWishlist,
  getWishlist,
  checkWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controller/wishlist.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Add product
router.post("/", protect, addToWishlist);

// Get logged-in user's wishlist
router.get("/", protect, getWishlist);

// Check product
router.get("/check/:productId", protect, checkWishlist);

// Remove product
router.delete("/:productId", protect, removeFromWishlist);

// Clear wishlist
router.delete("/", protect, clearWishlist);

export default router;