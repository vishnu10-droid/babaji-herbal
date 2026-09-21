import crypto from "crypto";
import Cart from "../model/cart.js";
import Order from "../model/order.js";
import Product from "../model/product.js";
import Coupon from "../model/coupon.js";
import { getRazorpay } from "../config/razorpay.js";

const FREE_SHIPPING_ABOVE = 999;
const SHIPPING_FLAT = 79;

// Re-price every cart line from the DB so the frontend amount is never trusted.
async function priceCartItems(cartItems) {
  const priced = [];
  let subtotal = 0;
  for (const item of cartItems) {
    const product = await Product.findById(item.productId);
    if (!product || product.status === "Inactive") {
      throw new Error(
        `Product "${item.productName || "item"}" is no longer available`,
      );
    }
    let price = product.sellingPrice;
    let name = product.name;
    if (item.variationId) {
      const variation = product.variations.id(item.variationId);
      if (!variation || variation.isActive === false) {
        throw new Error(
          `Variation for "${product.name}" is no longer available`,
        );
      }
      if (variation.stock < Number(item.quantity)) {
        throw new Error(
          `Insufficient stock for "${product.name} (${variation.name})"`,
        );
      }
      price = variation.price;
    } else if (product.stock < Number(item.quantity)) {
      throw new Error(`Insufficient stock for "${product.name}"`);
    }
    const lineTotal = Number(price) * Number(item.quantity);
    subtotal += lineTotal;
    priced.push({
      product: product._id,
      name,
      variationName: item.variationName || "",
      quantity: Number(item.quantity),
      price: Number(price),
    });
  }
  return { priced, subtotal };
}

async function resolveCoupon(code, subtotal) {
  if (!code?.trim()) return { discount: 0, couponCode: "" };
  const coupon = await Coupon.findOne({
    code: String(code).toUpperCase().trim(),
  });
  if (!coupon) throw new Error("Invalid coupon code");
  if (!coupon.isActive) throw new Error("Coupon is not active");
  if (coupon.expiry && new Date(coupon.expiry) < new Date())
    throw new Error("Coupon has expired");
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    throw new Error("Coupon usage limit reached");
  }
  if (subtotal < Number(coupon.minOrder || 0)) {
    throw new Error(
      `Minimum order of ₹${coupon.minOrder} required for this coupon`,
    );
  }
  const discount =
    coupon.discountType === "percent"
      ? Math.round((subtotal * Number(coupon.discountValue)) / 100)
      : Math.min(Number(coupon.discountValue), subtotal);
  return { discount, couponCode: coupon.code, coupon };
}

// POST /api/payment/create-order (auth required)
export const createPaymentOrder = async (req, res) => {
  try {
    const {
      name = "",
      address = "",
      city = "",
      couponCode = "",
    } = req.body || {};
    if (!name.trim() || !address.trim() || !city.trim()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Name, address and city are required",
        });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart?.items?.length) {
      return res
        .status(400)
        .json({ success: false, message: "Your cart is empty" });
    }

    // Anti-duplicate: if user already has a pending unpaid order with identical
    // cart created in the last 10 min, reuse it instead of creating a new one.
    const { priced, subtotal } = await priceCartItems(cart.items);
    const {
      discount,
      couponCode: validCode,
      coupon,
    } = await resolveCoupon(couponCode, subtotal);
    const shipping =
      subtotal - discount > FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FLAT;
    const totalAmount = Math.max(0, subtotal - discount + shipping);
    if (totalAmount < 1) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Order total is too low for online payment",
        });
    }

    const cartFingerprint = priced
      .map((i) => `${i.product}:${i.variationName}:${i.quantity}:${i.price}`)
      .join("|");
    const recentPending = await Order.findOne({
      user: req.user._id,
      paymentStatus: "pending",
      status: "Pending",
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
    }).sort({ createdAt: -1 });

    let order = null;
    if (
      recentPending &&
      recentPending.totalAmount === totalAmount &&
      (recentPending.items || [])
        .map((i) => `${i.product}:${i.variationName}:${i.quantity}:${i.price}`)
        .join("|") === cartFingerprint
    ) {
      order = recentPending;
    } else {
      order = await Order.create({
        user: req.user._id,
        items: priced,
        shippingAddress: {
          name: name.trim(),
          address: address.trim(),
          city: city.trim(),
        },
        subtotal,
        discount,
        couponCode: validCode,
        shipping,
        totalAmount,
        status: "Pending",
        paymentMethod: "Razorpay",
        paymentStatus: "pending",
      });
    }

    // Amount in paise (INR 100 = 10000 paise). Never trust frontend amount.
    const razorpay = getRazorpay();
    let rzpOrder;
    try {
      const existingValid =
        order.razorpayOrderId && order.totalAmount === totalAmount;
      if (existingValid) {
        try {
          rzpOrder = await razorpay.orders.fetch(order.razorpayOrderId);
          if (rzpOrder.status === "paid") {
            return res
              .status(409)
              .json({ success: false, message: "This order is already paid" });
          }
        } catch {
          rzpOrder = null; // stale id -> create fresh below
        }
      }
      if (!rzpOrder || rzpOrder.amount !== Math.round(totalAmount * 100)) {
        rzpOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100),
          currency: "INR",
          receipt: `babaji_${order._id.toString().slice(-12)}_${Date.now().toString().slice(-6)}`,
          notes: {
            mongoOrderId: order._id.toString(),
            userId: req.user._id.toString(),
          },
        });
        order.razorpayOrderId = rzpOrder.id;
        await order.save();
      }
    } catch (rzpErr) {
      console.error(
        "Razorpay orders.create failed:",
        rzpErr?.error || rzpErr.message,
      );
      return res
        .status(502)
        .json({
          success: false,
          message: "Payment gateway unreachable. Please try again.",
        });
    }
    void coupon;

    return res.status(201).json({
      success: true,
      message: "Razorpay order created",
      keyId: process.env.RAZORPAY_KEY_ID, // Key ID only — secret never leaves backend
      orderId: order._id,
      razorpayOrder: {
        id: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
      },
      summary: {
        subtotal,
        discount,
        shipping,
        totalAmount,
        couponCode: validCode,
      },
    });
  } catch (error) {
    console.error("CREATE PAYMENT ORDER ERROR:", error.message);
    const status =
      error.message?.toLowerCase().includes("coupon") ||
      error.message?.toLowerCase().includes("stock") ||
      error.message?.toLowerCase().includes("available")
        ? 400
        : 500;
    return res
      .status(status)
      .json({
        success: false,
        message: error.message || "Could not initiate payment",
      });
  }
};

// POST /api/payment/verify (auth required)
export const verifyPayment = async (req, res) => {
  try {
    const {
      mongoOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};
    if (
      !mongoOrderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing payment verification fields",
        });
    }

    const order = await Order.findOne({
      _id: mongoOrderId,
      user: req.user._id,
    });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    if (order.paymentStatus === "paid") {
      return res.json({
        success: true,
        message: "Payment already verified",
        order,
      }); // idempotent
    }
    if (order.razorpayOrderId && order.razorpayOrderId !== razorpay_order_id) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Order ID mismatch. Possible tampering detected.",
        });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const sigBuf = Buffer.from(razorpay_signature);
    const expBuf = Buffer.from(expectedSignature);
    const valid =
      sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);
    if (!valid) {
      order.paymentStatus = "failed";
      order.status = "Failed";
      await order.save();
      return res
        .status(400)
        .json({
          success: false,
          message: "Payment signature verification failed",
        });
    }

    order.paymentStatus = "paid";
    order.status = "Confirmed";
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paidAt = new Date();
    await order.save();

    if (order.couponCode) {
      await Coupon.updateOne(
        { code: order.couponCode },
        { $inc: { usedCount: 1 } },
      );
    }
    // Payment succeeded -> clear the purchased cart (do not clear on failure).
    await Cart.updateOne(
      { userId: req.user._id },
      { $set: { items: [], totalAmount: 0 } },
    );

    return res.json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
};

// POST /api/payment/failed (auth required) — keeps order unpaid, records failure
export const markPaymentFailed = async (req, res) => {
  try {
    const { mongoOrderId, razorpay_order_id, reason } = req.body || {};
    if (!mongoOrderId)
      return res
        .status(400)
        .json({ success: false, message: "mongoOrderId is required" });
    const order = await Order.findOne({
      _id: mongoOrderId,
      user: req.user._id,
    });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    if (order.paymentStatus === "paid") {
      return res
        .status(409)
        .json({ success: false, message: "Order is already paid" });
    }
    order.paymentStatus = "failed";
    order.status = "Failed";
    if (razorpay_order_id) order.razorpayOrderId = razorpay_order_id;
    await order.save();
    void reason;
    return res.json({
      success: true,
      message: "Payment failure recorded",
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/payment/key — frontend needs only the publishable Key ID
export const getRazorpayKey = (_req, res) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    return res
      .status(500)
      .json({ success: false, message: "Razorpay key not configured" });
  }
  return res.json({ success: true, keyId: process.env.RAZORPAY_KEY_ID });
};
