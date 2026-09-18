import mongoose from "mongoose";
import HeroSlide from "../model/heroSlide.model.js";
import {
  deleteImagekitFile,
  uploadToImageKit,
} from "../services/imagekitUpload.js";

/* =========================
   GET ALL HERO SLIDES
========================= */

export const getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find()
      .populate("productId", "name")
      .sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      slides,
    });
  } catch (error) {
    console.error("Get hero slides error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch hero slides",
      error: error.message,
    });
  }
};

/* =========================
   GET ACTIVE HERO SLIDES
========================= */

export const getActiveHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find({
      isActive: true,
    }).populate("productId", "name").sort({
      sortOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      slides,
    });
  } catch (error) {
    console.error("Get active hero slides error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch active hero slides",
      error: error.message,
    });
  }
};

/* =========================
   GET SINGLE HERO SLIDE
========================= */

export const getHeroSlideById = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    res.status(200).json({
      success: true,
      slide,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hero slide",
      error: error.message,
    });
  }
};

/* =========================
   CREATE HERO SLIDE
========================= */

export const createHeroSlide = async (req, res) => {
  try {
    const {
      eyebrow,
      title,
      description,
      action,
      to,
      productId,
      position,
      isActive,
      sortOrder,
    } = req.body;

    if (!req.file && !req.body.image) {
      return res.status(400).json({
        success: false,
        message: "Hero image is required",
      });
    }

    let image = req.body.image || "";
    let imageFileId = req.body.imageFileId || "";

    /* Raw file upload -> ImageKit (memory storage gives req.file.buffer) */
    if (req.file) {
      const uploaded = await uploadToImageKit(req.file, "hero");
      image = uploaded.url;
      imageFileId = uploaded.fileId;
    }

    /* Product link -> /product/:id (banner click par product khulega) */
    let linkedProductId = null;
    let linkTo = to || "/shop";
    const rawProductId = typeof productId === "string" ? productId.trim() : productId;
    if (rawProductId && mongoose.isValidObjectId(rawProductId)) {
      linkedProductId = rawProductId;
      linkTo = `/product/${rawProductId}`;
    }

    const slide = await HeroSlide.create({
      eyebrow: eyebrow || "",
      title: title || "",
      description: description || "",
      action: action || "",
      to: linkTo,
      productId: linkedProductId,
      image,
      imageFileId,
      position: position || "center",
      isActive:
        isActive === "false"
          ? false
          : true,
      sortOrder: Number(sortOrder) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Hero slide created successfully",
      slide,
    });
  } catch (error) {
    console.error("Create hero slide error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create hero slide",
      error: error.message,
    });
  }
};

/* =========================
   UPDATE HERO SLIDE
========================= */

export const updateHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    const {
      eyebrow,
      title,
      description,
      action,
      to,
      productId,
      position,
      isActive,
      sortOrder,
    } = req.body;

    slide.eyebrow = eyebrow ?? slide.eyebrow;
    slide.title = title ?? slide.title;
    slide.description = description ?? slide.description;
    slide.action = action ?? slide.action;
    slide.position = position ?? slide.position;

    /* Product link update */
    if (productId !== undefined) {
      const rawProductId = typeof productId === "string" ? productId.trim() : productId;
      if (rawProductId && mongoose.isValidObjectId(rawProductId)) {
        slide.productId = rawProductId;
        slide.to = `/product/${rawProductId}`;
      } else if (rawProductId === "" || rawProductId === null) {
        slide.productId = null;
        if (to !== undefined) slide.to = to || "/shop";
        else if (slide.to?.startsWith("/product/")) slide.to = "/shop";
      } else if (to !== undefined) {
        slide.to = to;
      }
    } else if (to !== undefined) {
      slide.to = to;
    }

    if (isActive !== undefined) {
      slide.isActive =
        isActive === "false" ? false : Boolean(isActive);
    }

    if (sortOrder !== undefined) {
      slide.sortOrder = Number(sortOrder);
    }

    /* New image uploaded */

    if (req.file) {
      const uploaded = await uploadToImageKit(req.file, "hero");

      if (slide.imageFileId) {
        await deleteImagekitFile(slide.imageFileId);
      }

      slide.image = uploaded.url;
      slide.imageFileId = uploaded.fileId;
    } else if (req.body.image) {
      slide.image = req.body.image;

      if (req.body.imageFileId !== undefined) {
        slide.imageFileId = req.body.imageFileId;
      }
    }

    await slide.save();

    res.status(200).json({
      success: true,
      message: "Hero slide updated successfully",
      slide,
    });
  } catch (error) {
    console.error("Update hero slide error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update hero slide",
      error: error.message,
    });
  }
};

/* =========================
   DELETE HERO SLIDE
========================= */

export const deleteHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    if (slide.imageFileId) {
      await deleteImagekitFile(slide.imageFileId);
    }

    await HeroSlide.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Hero slide deleted successfully",
    });
  } catch (error) {
    console.error("Delete hero slide error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete hero slide",
      error: error.message,
    });
  }
};

/* =========================
   TOGGLE ACTIVE STATUS
========================= */

export const toggleHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    slide.isActive = !slide.isActive;

    await slide.save();

    res.status(200).json({
      success: true,
      message: "Hero slide status updated",
      slide,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};