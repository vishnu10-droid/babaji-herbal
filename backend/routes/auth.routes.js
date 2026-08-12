import express from "express";
import { getProfile, getUsers, login, logout, register, updateProfile } from "../controller/authcontroller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/users", protect, getUsers);
router.post("/logout", protect, logout);
export default router;
