import express from "express";
import { createOrder, getMyOrders } from "../controller/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();
router.use(protect);
router.route("/").get(getMyOrders).post(createOrder);
export default router;
