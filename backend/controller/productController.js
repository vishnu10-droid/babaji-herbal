import Product from "../model/product.js";
import Category from "../model/category.js";
import mongoose from "mongoose";
import {
  deleteImagekitFile,
  uploadMultipleToImageKit,
} from "../services/imagekitUpload.js";

// ========================================
// HELPERS
// ========================================

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseVariations = (variations) => {
  if (!variations) {
    return [];
  }

  if (Array.isArray(variations)) {
    return variations;
  }

  if (typeof variations === "string") {
    return JSON.parse(variations);
  }

  return [];
};

const getCategoryFromRequest = async ({
  categoryId,
  category,
}) => {
  if (categoryId) {
    if (!mongoose.isValidObjectId(categoryId)) {
      return null;
    }

    return Category.findById(categoryId);
  }

  if (category?.trim()) {
    return Category.findOne({
      name: new RegExp(
        `^${escapeRegex(category.trim())}$`,
        "i",
      ),
    });
  }

  return null;
};

// ========================================
// IMAGE HELPERS
// ========================================
//
// Supported image shapes:
//   - string path   ("/uploads/products/x.jpg")
//   - string URL    ("https://...")
//   - object        ({ url, fileId })
// Normalized shape:
//   { url, fileId }

const imageToObject = (image) => {
  if (!image) {
    return null;
  }

  if (typeof image === "string") {
    const trimmed = image.trim();

    if (!trimmed) {
      return null;
    }

    return { url: trimmed, fileId: "" };
  }

  if (typeof image === "object") {
    const url =
      typeof image.url === "string" ? image.url.trim() : "";

    if (!url) {
      return null;
    }

    return {
      url,
      fileId:
        typeof image.fileId === "string"
          ? image.fileId.trim()
          : "",
    };
  }

  return null;
};

const parseImages = (images) => {
  if (!images || images.length === 0) {
    return [];
  }

  let list = images;

  if (typeof images === "string") {
    try {
      list = JSON.parse(images);
    } catch {
      list = [images];
    }
  }

  if (!Array.isArray(list)) {
    list = [list];
  }

  return list.map(imageToObject).filter(Boolean);
};

const getFileIds = (images) =>
  (images || [])
    .map((image) =>
      typeof image === "string" ? "" : image?.fileId || "",
    )
    .filter(Boolean);

// ========================================
// CREATE PRODUCT
// ========================================

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      categoryId,
      brand,
      shortDescription,
      description,
      ingredients,
      indications,
      dosage,
      mrp,
      sellingPrice,
      discount,
      stock,
      availability,
      status,
      featured,
      variations,
    } = req.body;

    // ========================================
    // IMAGES
    // ========================================
    //
    // Two sources:
    //   1. req.body.images - frontend ne pehle
    //      upload karke { url, fileId } bheje
    //   2. req.files        - raw files (legacy
    //      direct-upload flow) jo yahan ImageKit
    //      par upload hote hain

    let images = parseImages(req.body.images);

    if (req.files && req.files.length > 0) {
      const uploaded =
        await uploadMultipleToImageKit(req.files, "products");

      images = [...images, ...uploaded];
    }

    // ========================================
    // CATEGORY
    // ========================================

    const selectedCategory =
      await getCategoryFromRequest({
        categoryId,
        category,
      });

    if (!selectedCategory) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a valid category before adding the product",
      });
    }

    // ========================================
    // VARIATIONS
    // ========================================

    let parsedVariations = [];

    try {
      parsedVariations =
        parseVariations(variations);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid variations JSON",
      });
    }

    // ========================================
    // CREATE PRODUCT
    // ========================================

    const product = await Product.create({
      name,

      category: selectedCategory.name,

      categoryId: selectedCategory._id,

      brand,

      shortDescription,

      description,

      ingredients,

      indications,

      dosage,

      mrp: Number(mrp) || 0,

      sellingPrice:
        Number(sellingPrice) || 0,

      discount:
        Number(discount) || 0,

      stock:
        Number(stock) || 0,

      availability,

      status,

      featured:

        typeof featured === "string"
          ? featured === "true"
          : Boolean(featured),

      images,

      variations: parsedVariations,
    });

    return res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.error(
      "CREATE PRODUCT ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET ALL PRODUCTS
// ========================================

export const getProducts = async (req, res) => {
  try {
    const {
      categoryId,
      category,
    } = req.query;

    const selectedCategory =
      await getCategoryFromRequest({
        categoryId,
        category,
      });

    if (
      (categoryId || category) &&
      !selectedCategory
    ) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const filter = selectedCategory
      ? {
          $or: [
            {
              categoryId:
                selectedCategory._id,
            },
            {
              category: new RegExp(
                `^${escapeRegex(
                  selectedCategory.name,
                )}$`,
                "i",
              ),
            },
          ],
        }
      : {};

    const products =
      await Product.find(filter).sort({
        createdAt: -1,
      });

    return res.status(200).json(products);
  } catch (error) {
    console.error(
      "GET PRODUCTS ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET PRODUCT BY ID
// ========================================

export const getProduct = async (req, res) => {
  try {
    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(
      "GET PRODUCT ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// UPDATE PRODUCT
// ========================================

export const updateProduct = async (req, res) => {
  try {
    const existingProduct =
      await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    const updatedData = {
      ...req.body,
    };

    // ========================================
    // CATEGORY
    // ========================================

    const categoryWasProvided =
      Object.hasOwn(
        updatedData,
        "categoryId",
      ) ||
      Object.hasOwn(
        updatedData,
        "category",
      );

    if (categoryWasProvided) {
      const selectedCategory =
        await getCategoryFromRequest({
          categoryId:
            updatedData.categoryId,

          category:
            updatedData.category,
        });

      if (!selectedCategory) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a valid category before updating the product",
        });
      }

      updatedData.category =
        selectedCategory.name;

      updatedData.categoryId =
        selectedCategory._id;
    }

    // ========================================
    // IMAGES
    // ========================================
    //
    // New image list banai jaati hai:
    //   - agar body me images aaye to unhe
    //     use karo (frontend already ImageKit
    //     par upload kar chuka hai)
    //   - agar raw files aaye to unhe ImageKit
    //     par upload karo aur new list me add
    //     karo
    //   - jo purani images new list me nahi
    //     hain (remove hue fileIds), unhe
    //     ImageKit se delete karo

    let newImages;

    if (Object.hasOwn(req.body, "images")) {
      newImages = parseImages(req.body.images);
    } else {
      newImages = (existingProduct.images || []).map(
        (image) =>
          typeof image === "string"
            ? { url: image, fileId: "" }
            : {
                url: image?.url || "",
                fileId: image?.fileId || "",
              },
      );
    }

    if (req.files && req.files.length > 0) {
      const uploaded =
        await uploadMultipleToImageKit(
          req.files,
          "products",
        );

      newImages = [...newImages, ...uploaded];
    }

    updatedData.images = newImages;

    // ========================================
    // DELETE REMOVED IMAGES FROM IMAGEKIT
    // ========================================

    const previousFileIds = new Set(
      getFileIds(existingProduct.images),
    );

    const currentFileIds = new Set(
      getFileIds(newImages),
    );

    for (const fileId of previousFileIds) {
      if (!currentFileIds.has(fileId)) {
        await deleteImagekitFile(fileId);
      }
    }

    // ========================================
    // VARIATIONS
    // ========================================

    if (
      Object.hasOwn(
        updatedData,
        "variations",
      )
    ) {
      try {
        updatedData.variations =
          parseVariations(
            updatedData.variations,
          );
      } catch {
        return res.status(400).json({
          success: false,
          message:
            "Invalid variations JSON",
        });
      }
    }

    // ========================================
    // NUMBER CONVERSIONS
    // ========================================

    if (
      updatedData.mrp !== undefined
    ) {
      updatedData.mrp =
        Number(updatedData.mrp) || 0;
    }

    if (
      updatedData.sellingPrice !==
      undefined
    ) {
      updatedData.sellingPrice =
        Number(
          updatedData.sellingPrice,
        ) || 0;
    }

    if (
      updatedData.discount !==
      undefined
    ) {
      updatedData.discount =
        Number(
          updatedData.discount,
        ) || 0;
    }

    if (
      updatedData.stock !== undefined
    ) {
      updatedData.stock =
        Number(updatedData.stock) || 0;
    }

    if (
      updatedData.featured !==
      undefined
    ) {
      updatedData.featured =
        typeof updatedData.featured === "string"
          ? updatedData.featured === "true"
          : Boolean(updatedData.featured);
    }

    // ========================================
    // UPDATE PRODUCT
    // ========================================

    const product =
      await Product.findByIdAndUpdate(
        existingProduct._id,
        updatedData,
        {
          new: true,
          runValidators: true,
        },
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product Updated",
      product,
    });
  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// DELETE PRODUCT
// ========================================

export const deleteProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id,
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    // ========================================
    // DELETE ASSOCIATED IMAGEKIT IMAGES
    // ========================================

    const fileIds = getFileIds(product.images);

    for (const fileId of fileIds) {
      await deleteImagekitFile(fileId);
    }

    return res.status(200).json({
      success: true,
      message: "Product Deleted",
    });
  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};