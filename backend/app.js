import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";

import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import Category from "./routes/category.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import contactRouter from "./routes/contact.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import orderRouter from "./routes/order.routes.js";
import reviewRouter from "./routes/review.routes.js";
import adminRouter from "./routes/admin.routes.js";
import heroSlideRouteS from "./routes/heroSlide.routes.js";
import couponRouter from "./routes/coupon.routes.js";

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://frontend-tau-amber-fcjg2ssata.vercel.app",
  ...String(process.env.FRONTEND_URLS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  ...String(process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

// Vercel preview deployments (xxx.vercel.app) ko allow karo.
// Production me FRONTEND_URLS env me exact domain set karna best hai,
// lekin ye regex preview URL break hone se bachata hai.
const allowedOriginPatterns = [/\.vercel\.app$/];

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  return allowedOriginPatterns.some((pattern) => pattern.test(origin));
}

const app = express();
app.use(
  cors({
    origin(origin, callback) {
      // Server-to-server requests and Render health checks do not send Origin.
      if (isOriginAllowed(origin)) return callback(null, true);
      return callback(new Error("This origin is not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Existing locally-stored uploads ko serve karte
// raho (migration period ke liye)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ========================================
// ROUTES
// ========================================

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/category", Category);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/contact", contactRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);
app.use("/api/hero-slides",heroSlideRouteS)
// Backward-compatible alias (old singular path)
app.use("/api/hero-slide",heroSlideRouteS)
app.use("/api/coupons", couponRouter);

// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is running",
  });
});

// ========================================
// JSON ERROR HANDLER
// ========================================
//
// Multer file-filter / size errors aur any
// other error JSON me return karo, taaki
// frontend user-friendly message dikha sake.

app.use((error, req, res, next) => {
  void next;

  // Error response me bhi CORS headers bhejo, taaki browser
  // asal status (403/500) dikhaye, "blocked by CORS" nahi.
  const requestOrigin = req.headers.origin;
  if (requestOrigin && isOriginAllowed(requestOrigin)) {
    res.header("Access-Control-Allow-Origin", requestOrigin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
  }

  // CORS rejection ko 500 ki jagah 403 banao (debugging easy hoga)
  if (error?.message === "This origin is not allowed by CORS") {
    console.error("CORS BLOCKED origin:", requestOrigin);
    return res.status(403).json({
      success: false,
      message: `CORS: Origin ${requestOrigin} not allowed. Add it to FRONTEND_URLS env.`,
    });
  }

  console.error("EXPRESS ERROR:", error?.message || error);

  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "File too large. Please select a smaller image."
        : "Image upload failed. Please try again.";

    return res.status(400).json({ success: false, message });
  }

  if (error?.message?.toLowerCase().includes("image")) {
    return res.status(400).json({ success: false, message: error.message });
  }

  return res.status(500).json({
    success: false,
    message: error?.message || "Internal server error",
  });
});

export default app;
