import User from "../model/user.model.js";
import Product from "../model/product.js";
import Order from "../model/order.js";
import Review from "../model/review.js";
import StoreSettings from "../model/storeSettings.js";

export const getAdminOrders = async (_req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json({ success: true, orders });
};
export const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, order });
};
export const getCustomers = async (_req, res) => {
  const users = await User.find({ role: "user" }).select("name email phone createdAt").sort({ createdAt: -1 }).lean();
  const orderCounts = await Order.aggregate([{ $group: { _id: "$user", orders: { $sum: 1 }, spent: { $sum: "$totalAmount" } } }]);
  const countMap = new Map(orderCounts.map((item) => [String(item._id), item]));
  res.json({ success: true, customers: users.map((user) => ({ ...user, ...(countMap.get(String(user._id)) || { orders: 0, spent: 0 }) })) });
};
export const getReviews = async (_req, res) => res.json({ success: true, reviews: await Review.find().populate("user", "name email").populate("product", "name").sort({ createdAt: -1 }) });
export const updateReviewStatus = async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!review) return res.status(404).json({ success: false, message: "Review not found" });
  res.json({ success: true, review });
};
export const getSettings = async (_req, res) => res.json({ success: true, settings: await StoreSettings.findOneAndUpdate({ key: "store" }, {}, { new: true, upsert: true, setDefaultsOnInsert: true }) });
export const updateSettings = async (req, res) => {
  const allowed = ["storeName", "supportEmail", "shippingFee", "freeShippingAbove", "taxRate", "inventoryAlerts"];
  const data = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const settings = await StoreSettings.findOneAndUpdate({ key: "store" }, data, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
  res.json({ success: true, settings });
};
export const getProductReport = async (_req, res) => {
  const [products, sold] = await Promise.all([Product.find().sort({ createdAt: -1 }).lean(), Order.aggregate([{ $unwind: "$items" }, { $group: { _id: "$items.product", unitsSold: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } }])]);
  const soldMap = new Map(sold.map((item) => [String(item._id), item]));
  res.json({ success: true, products: products.map((product) => ({ ...product, ...(soldMap.get(String(product._id)) || { unitsSold: 0, revenue: 0 }) })) });
};
