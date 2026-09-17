import Coupon from "../model/coupon.js";

/* =========================
   GET ALL COUPONS (admin)
========================= */
export const getCoupons = async (_req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch coupons", error: error.message });
  }
};

/* =========================
   CREATE COUPON (admin)
========================= */
export const createCoupon = async (req, res) => {
  try {
    const { code, campaign, discountType, discountValue, minOrder, maxUses, isActive, expiry } = req.body;

    if (!code || discountValue === undefined || discountValue === null) {
      return res.status(400).json({ success: false, message: "Coupon code and discount value are required" });
    }

    const exists = await Coupon.findOne({ code: String(code).toUpperCase().trim() });
    if (exists) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code: String(code).toUpperCase().trim(),
      campaign: campaign || "",
      discountType: discountType || "percent",
      discountValue: Number(discountValue),
      minOrder: Number(minOrder) || 0,
      maxUses: Number(maxUses) || 0,
      isActive: isActive === undefined ? true : Boolean(isActive),
      expiry: expiry ? new Date(expiry) : null,
    });

    res.status(201).json({ success: true, message: "Coupon created", coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create coupon", error: error.message });
  }
};

/* =========================
   UPDATE COUPON (admin)
========================= */
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

    const { code, campaign, discountType, discountValue, minOrder, maxUses, isActive, expiry } = req.body;

    if (code !== undefined) coupon.code = String(code).toUpperCase().trim();
    if (campaign !== undefined) coupon.campaign = campaign;
    if (discountType !== undefined) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = Number(discountValue);
    if (minOrder !== undefined) coupon.minOrder = Number(minOrder);
    if (maxUses !== undefined) coupon.maxUses = Number(maxUses);
    if (isActive !== undefined) coupon.isActive = Boolean(isActive);
    if (expiry !== undefined) coupon.expiry = expiry ? new Date(expiry) : null;

    await coupon.save();
    res.json({ success: true, message: "Coupon updated", coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update coupon", error: error.message });
  }
};

/* =========================
   DELETE COUPON (admin)
========================= */
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete coupon", error: error.message });
  }
};

/* =========================
   VALIDATE COUPON (public - checkout)
========================= */
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ success: false, message: "Coupon code is required" });

    const coupon = await Coupon.findOne({ code: String(code).toUpperCase().trim() });
    if (!coupon) return res.status(404).json({ success: false, message: "Invalid coupon code" });
    if (!coupon.isActive) return res.status(400).json({ success: false, message: "Coupon is not active" });
    if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }
    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    }

    const total = Number(orderTotal) || 0;
    if (total < Number(coupon.minOrder || 0)) {
      return res.status(400).json({ success: false, message: `Minimum order of ₹${coupon.minOrder} required` });
    }

    let discount = 0;
    if (coupon.discountType === "percent") {
      discount = Math.round((total * Number(coupon.discountValue)) / 100);
    } else {
      discount = Math.min(Number(coupon.discountValue), total);
    }

    res.json({ success: true, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue }, discount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to validate coupon", error: error.message });
  }
};
