import Category from "../model/category.js";
import Product from "../model/product.js";
import {
  deleteImagekitFile,
  uploadToImageKit,
} from "../services/imagekitUpload.js";
import {
  clearCategoryListCache,
  getCachedCategoryList,
  setCachedCategoryList,
} from "../services/categoryListCache.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ========================================
// IMAGE HELPERS
// ========================================

const toImageData = (image) => {
  if (!image) {
    return { url: "", fileId: "" };
  }

  if (typeof image === "string") {
    const trimmed = image.trim();
    if (!trimmed) return { url: "", fileId: "" };

    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object") {
        return {
          url: typeof parsed.url === "string" ? parsed.url.trim() : "",
          fileId: typeof parsed.fileId === "string" ? parsed.fileId.trim() : "",
        };
      }
    } catch {
      // Not a JSON object -> plain image path/URL
    }

    return { url: trimmed, fileId: "" };
  }

  if (typeof image === "object") {
    return {
      url: typeof image.url === "string" ? image.url.trim() : "",
      fileId: typeof image.fileId === "string" ? image.fileId.trim() : "",
    };
  }

  return { url: "", fileId: "" };
};

const getBodyImageData = (req) => {
  if (req.file) return null; // raw file - handled separately

  const bodyImage = req.body?.image;

  if (!bodyImage) return null;

  return toImageData(bodyImage);
};

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { description, isActive } = req.body;
    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existing = await Category.findOne({
      name: new RegExp(`^${escapeRegex(name)}$`, "i"),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    let imageData = { url: "", fileId: "" };

    if (req.file) {
      imageData = await uploadToImageKit(req.file, "categories");
    } else {
      const bodyData = getBodyImageData(req);

      if (bodyData) {
        imageData = bodyData;
      }
    }

    const category = await Category.create({
      name,
      description,
      isActive:
        typeof isActive === "string"
          ? isActive === "true"
          : Boolean(isActive),
      image: imageData.url,
      imageFileId: imageData.fileId,
    });

    clearCategoryListCache();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Categories
export const getCategories = async (req, res) => {
  try {
    const cached = getCachedCategoryList();
    if (cached) {
      res.set("X-Cache", "HIT");
      res.set("Cache-Control", "public, max-age=60");
      return res.status(200).json(cached);
    }

    // These queries do not depend on one another, so run them together.
    const [categories, counts, nameCounts] = await Promise.all([
      Category.find().sort({ name: 1 }).lean(),
      Product.aggregate([
      {
        $group: {
          _id: "$categoryId",
          count: { $sum: 1 },
          names: { $push: "$name" },
        },
      },
      ]),

      // category string wale legacy products ke liye alag group
      Product.aggregate([
      {
        $group: {
          _id: { $toLower: "$category" },
          count: { $sum: 1 },
          names: { $push: "$name" },
        },
      },
      ]),
    ]);

    const byId = new Map(
      counts.map((c) => [String(c._id), c]),
    );

    const byName = new Map(
      nameCounts.map((c) => [String(c._id), c]),
    );

    const categoriesWithProducts = categories.map((category) => {
      const idKey = String(category._id);
      const nameKey = String(category.name || "")
        .trim()
        .toLowerCase();

      const idData = byId.get(idKey);
      const nameData = byName.get(nameKey);

      // categoryId match ko priority, warna name match
      const matched = idData || nameData || { count: 0, names: [] };

      return {
        ...category,
        productCount: matched.count || 0,
        productNames: (matched.names || []).slice(0, 4),
      };
    });

    const response = {
      success: true,
      count: categoriesWithProducts.length,
      data: categoriesWithProducts,
    };

    setCachedCategoryList(response);
    res.set("X-Cache", "MISS");
    res.set("Cache-Control", "public, max-age=60");
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Category By ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const updateData = { ...req.body };
    const currentCategory = await Category.findById(req.params.id);

    if (!currentCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (typeof updateData.name === "string") {
      updateData.name = updateData.name.trim();
      if (!updateData.name) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      const duplicate = await Category.findOne({
        _id: { $ne: currentCategory._id },
        name: new RegExp(`^${escapeRegex(updateData.name)}$`, "i"),
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Category already exists",
        });
      }
    }

    // ========================================
    // IMAGE
    // ========================================
    //
    // Agar nayi image aayi hai (ImageKit upload
    // se ya raw file se) to purani ImageKit
    // image delete karke nayi save karo.

    delete updateData.image;
    delete updateData.imageFileId;

    let imageData = {
      url: currentCategory.image || "",
      fileId: currentCategory.imageFileId || "",
    };

    if (req.file) {
      const uploaded = await uploadToImageKit(req.file, "categories");
      if (imageData.fileId) await deleteImagekitFile(imageData.fileId);
      imageData = uploaded;
    } else if (Object.hasOwn(req.body, "image")) {
      const bodyData = req.body.image
        ? toImageData(req.body.image)
        : { url: "", fileId: "" };

      if (
        (!bodyData.url && imageData.fileId) ||
        (bodyData.url && bodyData.url !== imageData.url)
      ) {
        if (imageData.fileId) await deleteImagekitFile(imageData.fileId);
        imageData = bodyData;
      } else if (bodyData.url === imageData.url && bodyData.fileId) {
        imageData.fileId = bodyData.fileId;
      }
    }

    updateData.image = imageData.url;
    updateData.imageFileId = imageData.fileId;

    const category = await Category.findByIdAndUpdate(currentCategory._id, updateData, {
      new: true,
      runValidators: true,
    });

    clearCategoryListCache();

    if (category.name !== currentCategory.name) {
      await Product.updateMany(
        {
          $or: [
            { categoryId: category._id },
            { category: new RegExp(`^${escapeRegex(currentCategory.name)}$`, "i") },
          ],
        },
        {
          $set: {
            category: category.name,
            categoryId: category._id,
          },
        },
      );
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const productCount = await Product.countDocuments({
      $or: [
        { categoryId: category._id },
        { category: new RegExp(`^${escapeRegex(category.name)}$`, "i") },
      ],
    });

    if (productCount > 0) {
      return res.status(409).json({
        success: false,
        message: "This category cannot be deleted while products are assigned to it",
      });
    }

    if (category.imageFileId) {
      await deleteImagekitFile(category.imageFileId);
    }

    await category.deleteOne();
    clearCategoryListCache();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
