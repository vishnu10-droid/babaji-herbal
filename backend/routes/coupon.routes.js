import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from "../controller/coupon.controller.js";

const router = express.Router();

/* Public - checkout validation */
router.post("/validate", validateCoupon);

/* Admin CRUD */
router.use(protect, admin);
router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").put(updateCoupon).delete(deleteCoupon);

export default router;
