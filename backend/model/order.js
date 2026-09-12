import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  variationName: { type: String, default: "" },
  quantity: { type: Number, min: 1, required: true },
  price: { type: Number, min: 0, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [orderItemSchema], default: [] },
  shippingAddress: { name: String, address: String, city: String },
  subtotal: { type: Number, required: true, min: 0 },
  shipping: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
