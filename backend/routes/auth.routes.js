import express from "express";
import { adminLogin, getProfile, getUsers, login, logout, register, updateProfile } from "../controller/authcontroller.js";
import { protect } from "../middleware/auth.middleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/users", protect, admin, getUsers);
router.post("/logout", protect, logout);
export default router;
