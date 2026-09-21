import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createPaymentOrder,
  verifyPayment,
  markPaymentFailed,
  getRazorpayKey,
} from "../controller/payment.controller.js";

const router = express.Router();

// Publishable Key ID only (safe for frontend). Secret never exposed.
router.get("/key", getRazorpayKey);

router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);
router.post("/failed", protect, markPaymentFailed);

export default router;
