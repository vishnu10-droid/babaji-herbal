import express from "express";

import upload from "../services/multer.js";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";
import { protect } from "../middleware/auth.middleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// GET ALL PRODUCTS
router.get("/", getProducts);

// GET PRODUCT BY ID
router.get("/:id", getProduct);

// CREATE PRODUCT
// "images" must match Postman field name
router.post("/", protect, admin, upload.array("images", 10), createProduct);

// UPDATE PRODUCT
router.put("/:id", protect, upload.array("images", 10), updateProduct);

// DELETE PRODUCT
router.delete("/:id", protect, deleteProduct);

export default router;
