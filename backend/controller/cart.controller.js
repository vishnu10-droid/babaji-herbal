import Cart from "../model/cart.js";
import Product from "../model/product.js";

// ========================================
// CALCULATE CART TOTAL
// ========================================

const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

// ========================================
// GET CART
// ========================================

export const getCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to view cart",
      });
    }

    let cart = await Cart.findOne({
      userId,
    }).populate("items.productId");

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
        totalAmount: 0,
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// ADD TO CART
// ========================================

export const addToCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to add products to cart",
      });
    }

    const {
      productId,
      variationId,
      quantity = 1,
    } = req.body;

    // ========================================
    // VALIDATE PRODUCT
    // ========================================

    const product = await Product.findById(
      productId
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ========================================
    // FIND VARIATION
    // ========================================

    let selectedVariation = null;

    if (variationId) {
      selectedVariation =
        product.variations.find(
          (variation) =>
            variation._id.toString() ===
            variationId.toString()
        );

      if (!selectedVariation) {
        return res.status(404).json({
          success: false,
          message: "Product variation not found",
        });
      }

      if (selectedVariation.isActive === false) {
        return res.status(400).json({
          success: false,
          message: "This variation is unavailable",
        });
      }

      if (
        selectedVariation.stock <
        Number(quantity)
      ) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }
    } else {
      if (product.stock < Number(quantity)) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }
    }

    // ========================================
    // GET / CREATE CART
    // ========================================

    let cart = await Cart.findOne({
      userId,
    });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    // ========================================
    // CHECK EXISTING ITEM
    //
    // IMPORTANT:
    // Same product + same variation = same item
    // ========================================

    const existingItem = cart.items.find(
      (item) => {
        const sameProduct =
          item.productId.toString() ===
          productId.toString();

        const sameVariation =
          String(item.variationId || "") ===
          String(variationId || "");

        return (
          sameProduct &&
          sameVariation
        );
      }
    );

    // ========================================
    // PRICE
    // ========================================

    const price =
      selectedVariation?.price ??
      product.sellingPrice;

    const mrp =
      selectedVariation?.mrp ??
      product.mrp;

    const variationName =
      selectedVariation?.name || "";

    const pouches =
      selectedVariation?.pouches || null;

    // ========================================
    // UPDATE EXISTING ITEM
    // ========================================

    if (existingItem) {
      const newQuantity =
        existingItem.quantity +
        Number(quantity);

      const availableStock =
        selectedVariation?.stock ??
        product.stock;

      if (newQuantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: "Requested quantity exceeds stock",
        });
      }

      existingItem.quantity =
        newQuantity;

      // Keep current database price
      existingItem.price = price;
      existingItem.mrp = mrp;
    }

    // ========================================
    // ADD NEW ITEM
    // ========================================

    else {
      cart.items.push({
        productId: product._id,

        variationId:
          selectedVariation?._id || null,

        variationName,

        pouches,

        quantity: Number(quantity),

        price,

        mrp,

        productName: product.name,

        image:
          typeof product.images?.[0] === "string"
            ? product.images[0]
            : product.images?.[0]?.url || "",
      });
    }

    // ========================================
    // TOTAL
    // ========================================

    cart.totalAmount =
      calculateTotal(cart.items);

    await cart.save();

    await cart.populate(
      "items.productId"
    );

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error(
      "ADD TO CART ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// UPDATE CART ITEM QUANTITY
// ========================================

export const updateCartItem = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login",
      });
    }

    const {
      quantity,
    } = req.body;

    if (Number(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be at least 1",
      });
    }

    const cart =
      await Cart.findOne({
        userId,
      });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item =
      cart.items.id(
        req.params.itemId
      );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // ========================================
    // CHECK STOCK AGAIN
    // ========================================

    const product =
      await Product.findById(
        item.productId
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let availableStock =
      product.stock;

    if (item.variationId) {
      const variation =
        product.variations.id(
          item.variationId
        );

      if (!variation) {
        return res.status(404).json({
          success: false,
          message:
            "Variation not found",
        });
      }

      availableStock =
        variation.stock;

      item.price =
        variation.price;

      item.mrp =
        variation.mrp;
    } else {
      item.price =
        product.sellingPrice;

      item.mrp =
        product.mrp;
    }

    if (
      Number(quantity) >
      availableStock
    ) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    item.quantity =
      Number(quantity);

    cart.totalAmount =
      calculateTotal(
        cart.items
      );

    await cart.save();

    return res.status(200).json({
      success: true,
      message:
        "Cart updated",
      cart,
    });
  } catch (error) {
    console.error(
      "UPDATE CART ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// REMOVE CART ITEM
// ========================================

export const removeCartItem = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login",
      });
    }

    const cart =
      await Cart.findOne({
        userId,
      });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item =
      cart.items.id(
        req.params.itemId
      );

    if (!item) {
      return res.status(404).json({
        success: false,
        message:
          "Cart item not found",
      });
    }

    item.deleteOne();

    cart.totalAmount =
      calculateTotal(
        cart.items
      );

    await cart.save();

    return res.status(200).json({
      success: true,
      message:
        "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error(
      "REMOVE CART ITEM ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// CLEAR CART
// ========================================

export const clearCart = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login",
      });
    }

    const cart =
      await Cart.findOne({
        userId,
      });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    console.error(
      "CLEAR CART ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};