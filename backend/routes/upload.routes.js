import express from "express";

import { protect } from "../middleware/auth.middleware.js";
import { categoryUpload, productUpload } from "../middleware/upload.js";
import {
  uploadMultipleImages,
  uploadSingleImage,
} from "../controller/uploadController.js";

const router = express.Router();

// ========================================
// SINGLE IMAGE
// POST /api/upload/image/:folder
// ========================================

router.post(
  "/image/:folder",
  protect,
  categoryUpload.single("image"),
  uploadSingleImage,
);

// ========================================
// MULTIPLE IMAGES
// POST /api/upload/images/:folder
// ========================================

router.post(
  "/images/:folder",
  protect,
  productUpload.array("images", 10),
  uploadMultipleImages,
);

export default router;