import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController.js";

import { protect } from "../middleware/auth.middleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import categoryUpload from "../services/categoryUpload.js";


const router = express.Router();

router.post("/", protect, admin, categoryUpload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", protect, admin, categoryUpload.single("image"), updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

export default router;
