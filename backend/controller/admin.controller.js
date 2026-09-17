import User from "../model/user.model.js";
import Product from "../model/product.js";
import Order from "../model/order.js";
import Review from "../model/review.js";
import StoreSettings from "../model/storeSettings.js";
import Category from "../model/category.js";
import HeroSlide from "../model/heroSlide.model.js";

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

/* =========================
   DASHBOARD STATS (admin home)
   Single endpoint powering all
   dashboard widgets - no dummy data.
========================= */
export const getDashboardStats = async (_req, res) => {
  try {
    const [productCount, categoryCount, orderCount, customerCount, orders, products] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.find().select("totalAmount status createdAt items user").populate("user", "name").sort({ createdAt: -1 }).lean(),
      Product.find().select("name category stock").lean(),
    ]);

    const validOrders = orders.filter((o) => o.status !== "Cancelled");
    const revenue = validOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    /* Last 6 months sales + revenue */
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: d.toLocaleString("en", { month: "short" }),
        sales: 0,
        revenue: 0,
      });
    }
    const monthMap = new Map(months.map((m) => [m.key, m]));
    validOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      const m = monthMap.get(`${d.getFullYear()}-${d.getMonth()}`);
      if (m) {
        m.sales += 1;
        m.revenue += Number(o.totalAmount || 0);
      }
    });

    /* Top products by units sold */
    const soldMap = {};
    validOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const key = String(item.product || item.name);
        if (!soldMap[key]) soldMap[key] = { name: item.name, sold: 0 };
        soldMap[key].sold += Number(item.quantity || 0);
      });
    });
    const topProducts = Object.values(soldMap).sort((a, b) => b.sold - a.sold).slice(0, 5);
    const maxSold = topProducts[0]?.sold || 1;
    topProducts.forEach((p) => { p.progress = Math.round((p.sold / maxSold) * 100); });

    /* Low stock products */
    const lowStock = await Product.find({ stock: { $lte: 10 } }).select("name stock").sort({ stock: 1 }).limit(5).lean();

    /* Recent orders */
    const recentOrders = orders.slice(0, 5).map((o) => ({
      id: o._id,
      customer: o.user?.name || "Guest",
      product: (o.items || []).map((i) => i.name).join(", ") || "-",
      amount: o.totalAmount,
      status: o.status,
      date: o.createdAt,
    }));

    /* Revenue share by category */
    const productCategory = new Map(products.map((p) => [String(p._id), p.category || "Other"]));
    const categoryRevenue = {};
    validOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const cat = productCategory.get(String(item.product)) || "Other";
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + Number(item.price || 0) * Number(item.quantity || 0);
      });
    });
    const categoryShare = Object.entries(categoryRevenue)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    res.json({
      success: true,
      stats: {
        products: productCount,
        categories: categoryCount,
        orders: orderCount,
        customers: customerCount,
        revenue,
        monthly: months.map(({ month, sales, revenue }) => ({ month, sales, revenue })),
        topProducts,
        lowStock,
        recentOrders,
        categoryShare,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch dashboard stats", error: error.message });
  }
};

/* =========================
   MEDIA GALLERY (all uploaded images)
========================= */
export const getMedia = async (_req, res) => {
  try {
    const [products, heroes, categories] = await Promise.all([
      Product.find().select("name images").lean(),
      HeroSlide.find().select("title image").lean(),
      Category.find().select("name image").lean(),
    ]);

    const media = [];
    const push = (url, source, name) => {
      if (!url) return;
      const finalUrl = typeof url === "string" ? url : url.url;
      if (!finalUrl) return;
      media.push({ url: finalUrl, source, name });
    };

    products.forEach((p) => (p.images || []).forEach((img) => push(img?.url || img, "Product", p.name)));
    heroes.forEach((h) => push(h.image, "Hero Slide", h.title || "Hero slide"));
    categories.forEach((c) => push(c.image, "Category", c.name));

    res.json({ success: true, count: media.length, media });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch media", error: error.message });
  }
};
