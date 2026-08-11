import express from "express";
import {
  register,
  verifyOTP,
  login,
  getUsers,
  logout,
} from "../controller/authcontroller.js";

import { protect } from "../middleware/auth.middleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/users", protect, admin, getUsers);
router.post("/logout", protect, logout);

export default router;