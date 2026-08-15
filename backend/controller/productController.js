import Product from "../model/product.js";
import Category from "../model/category.js";
import mongoose from "mongoose";

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
// CREATE PRODUCT
// ========================================

export const createProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

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

    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map(
        (file) =>
          `/uploads/products/${file.filename}`,
      );
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
    } catch (error) {
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

      featured,

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

    if (
      req.files &&
      req.files.length > 0
    ) {
      updatedData.images =
        req.files.map(
          (file) =>
            `/uploads/products/${file.filename}`,
        );
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
      } catch (error) {
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

    // ========================================
    // UPDATE PRODUCT
    // ========================================

    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
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