import express from "express";
import {
  createReview,
  deleteMyReview,
  getMyReviews,
  getProductReviews,
} from "../controller/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.use(protect);
router.route("/").post(createReview);
router.get("/my", getMyReviews);
router.delete("/:id", deleteMyReview);

export default router;
