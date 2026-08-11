import express from "express";

import upload from "../services/multer.js";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";

const router = express.Router();

// GET ALL PRODUCTS
router.get("/", getProducts);

// GET PRODUCT BY ID
router.get("/:id", getProduct);

// CREATE PRODUCT
// "images" must match Postman field name
router.post(
  "/",
  upload.array("images", 10),
  createProduct
);

// UPDATE PRODUCT
router.put(
  "/:id",
  upload.array("images", 10),
  updateProduct
);

// DELETE PRODUCT
router.delete("/:id", deleteProduct);

export default router;