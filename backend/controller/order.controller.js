import Cart from "../model/cart.js";
import Order from "../model/order.js";

export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart?.items.length) return res.status(400).json({ success: false, message: "Your cart is empty" });
    const { name = "", address = "", city = "" } = req.body;
    if (!name.trim() || !address.trim() || !city.trim()) return res.status(400).json({ success: false, message: "Name, address and city are required" });
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 999 ? 0 : 79;
    const order = await Order.create({ user: req.user._id, items: cart.items.map((item) => ({ product: item.productId, name: item.productName, variationName: item.variationName, quantity: item.quantity, price: item.price })), shippingAddress: { name, address, city }, subtotal, shipping, totalAmount: subtotal + shipping });
    cart.items = []; cart.totalAmount = 0; await cart.save();
    return res.status(201).json({ success: true, order });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

export const getMyOrders = async (req, res) => res.json({ success: true, orders: await Order.find({ user: req.user._id }).sort({ createdAt: -1 }) });

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (!["Pending", "Processing"].includes(order.status)) {
      return res.status(400).json({ success: false, message: `Order cannot be cancelled in "${order.status}" state` });
    }
    order.status = "Cancelled";
    await order.save();
    return res.json({ success: true, message: "Order cancelled", order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
