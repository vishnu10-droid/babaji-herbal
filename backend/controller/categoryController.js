import Category from "../model/category.js";
import Product from "../model/product.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

    const category = await Category.create({
      name,
      description,
      isActive,
      image: req.file ? `/uploads/categories/${req.file.filename}` : "",
    });

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
    const categories = await Category.find().sort({ name: 1 }).lean();
    const products = await Product.find()
      .select("name category categoryId status")
      .lean();

    const categoriesWithProducts = categories.map((category) => {
      const categoryProducts = products.filter((product) =>
        product.categoryId?.toString() === category._id.toString() ||
        product.category?.trim().toLowerCase() === category.name.trim().toLowerCase()
      );

      return {
        ...category,
        productCount: categoryProducts.length,
        productNames: categoryProducts.slice(0, 4).map((product) => product.name),
      };
    });

    res.status(200).json({
      success: true,
      count: categoriesWithProducts.length,
      data: categoriesWithProducts,
    });
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

    if (req.file) updateData.image = `/uploads/categories/${req.file.filename}`;
    const category = await Category.findByIdAndUpdate(currentCategory._id, updateData, {
      new: true,
      runValidators: true,
    });

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

    await category.deleteOne();

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
