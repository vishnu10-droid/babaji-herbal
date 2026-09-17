import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    campaign: {
      type: String,
      default: "",
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["percent", "flat"],
      default: "percent",
    },

    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: 0,
    },

    minOrder: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxUses: {
      type: Number,
      default: 0,
      min: 0,
    },

    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    expiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Coupon", couponSchema);
