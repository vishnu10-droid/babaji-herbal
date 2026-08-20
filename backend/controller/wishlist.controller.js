import Wishlist from "../model/wishlist.js";

// ========================================
// ADD PRODUCT TO WISHLIST
// POST /api/wishlist
// ========================================

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if product already exists in wishlist
    const existingWishlist = await Wishlist.findOne({
      user: userId,
      product: productId,
    });

    if (existingWishlist) {
      return res.status(409).json({
        success: false,
        message: "Product already exists in wishlist",
        wishlist: existingWishlist,
      });
    }

    const wishlist = await Wishlist.create({
      user: userId,
      product: productId,
    });
    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate("product");

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: populatedWishlist,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
      error: error.message,
    });
  }
};

// ========================================
// GET USER WISHLIST
// GET /api/wishlist
// ========================================

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.find({
      user: userId,
    })
      .populate("product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get wishlist",
      error: error.message,
    });
  }
};

// ========================================
// CHECK PRODUCT IN WISHLIST
// GET /api/wishlist/check/:productId
// ========================================

export const checkWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: userId,
      product: productId,
    });

    return res.status(200).json({
      success: true,
      isWishlisted: !!wishlist,
      wishlistId: wishlist?._id || null,
    });
  } catch (error) {
    console.error("Check wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to check wishlist",
      error: error.message,
    });
  }
};

// ========================================
// REMOVE PRODUCT FROM WISHLIST
// DELETE /api/wishlist/:productId
// ========================================

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOneAndDelete({
      user: userId,
      product: productId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist",
      error: error.message,
    });
  }
};

// ========================================
// CLEAR ENTIRE WISHLIST
// DELETE /api/wishlist
// ========================================

export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Wishlist.deleteMany({
      user: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Clear wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
      error: error.message,
    });
  }
};