import express from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controller/cart.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get logged-in user's cart
router.get(
  "/",
  protect,
  getCart
);

// Add product / variation
router.post(
  "/add",
  protect,
  addToCart
);

// Update quantity
router.put(
  "/item/:itemId",
  protect,
  updateCartItem
);

// Remove item
router.delete(
  "/item/:itemId",
  protect,
  removeCartItem
);

// Clear cart
router.delete(
  "/clear",
  protect,
  clearCart
);

export default router;
