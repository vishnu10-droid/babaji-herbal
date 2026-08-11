import Product from "../model/product.js";

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

    // ===============================
    // GET IMAGES
    // ===============================

    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map(
        (file) => `/uploads/products/${file.filename}`
      );
    }

    // ===============================
    // VARIATIONS
    // ===============================

    let parsedVariations = [];

    if (variations) {
      try {
        parsedVariations =
          typeof variations === "string"
            ? JSON.parse(variations)
            : variations;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid variations JSON",
        });
      }
    }

    // ===============================
    // CREATE PRODUCT
    // ===============================

    const product = await Product.create({
      name,
      category,
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
      images,
      variations: parsedVariations,
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
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
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
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
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    res.status(500).json({
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

    // ===============================
    // UPDATE IMAGES
    // ===============================

    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map(
        (file) => `/uploads/products/${file.filename}`
      );
    }

    // ===============================
    // UPDATE VARIATIONS
    // ===============================

    if (updatedData.variations) {
      try {
        updatedData.variations =
          typeof updatedData.variations === "string"
            ? JSON.parse(updatedData.variations)
            : updatedData.variations;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid variations JSON",
        });
      }
    }

    // ===============================
    // UPDATE
    // ===============================

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Updated",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
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
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Deleted",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};