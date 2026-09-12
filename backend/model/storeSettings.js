import mongoose from "mongoose";

const storeSettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: "store" },
  storeName: { type: String, default: "Babaji Herbal" },
  supportEmail: { type: String, default: "" },
  shippingFee: { type: Number, default: 79, min: 0 },
  freeShippingAbove: { type: Number, default: 999, min: 0 },
  taxRate: { type: Number, default: 0, min: 0 },
  inventoryAlerts: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("StoreSettings", storeSettingsSchema);
