import express from "express";

import { productUpload } from "../middleware/upload.js";

import {
  getHeroSlides,
  getActiveHeroSlides,
  getHeroSlideById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  toggleHeroSlide,
} from "../controller/heroSlide.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* Public */

router.get("/active", getActiveHeroSlides);

router.get("/", getHeroSlides);

router.get("/:id", getHeroSlideById);

/* Admin */

router.post(
  "/",
  protect,
  admin,
  productUpload.single("image"),
  createHeroSlide
);

router.put(
  "/:id",
  protect,
  admin,
  productUpload.single("image"),
  updateHeroSlide
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteHeroSlide
);

router.patch(
  "/:id/toggle",
  protect,
  admin,
  toggleHeroSlide
);

export default router;
