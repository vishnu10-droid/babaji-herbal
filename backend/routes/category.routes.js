import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController.js";

import { protect } from "../middleware/auth.middleware.js";
import { admin } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/",protect,createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;