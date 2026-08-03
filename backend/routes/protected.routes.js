const express = require("express");
const router = express.Router();

const productController = require("../controller/productController");

// Create Product
router.post("/product", productController.store);

// Get All Products
router.get("/product", productController.list);

// Get Single Product
router.get("/product/:id", productController.details);

// Update Product
router.put("/product/:id", productController.update);

// Delete Product
router.delete("/product/:id", productController.destroy);

module.exports = router;