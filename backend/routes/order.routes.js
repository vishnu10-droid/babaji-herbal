import express from "express";
import { cancelMyOrder, createOrder, getMyOrders, getOrderById } from "../controller/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();
router.use(protect);
router.route("/").get(getMyOrders).post(createOrder);
router.get("/:id", getOrderById);
router.patch("/:id/cancel", cancelMyOrder);
export default router;
