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
import adminRouter from "./routes/admin.routes.js";

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...String(process.env.FRONTEND_URLS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const app = express();
app.use(
  cors({
    origin(origin, callback) {
      // Server-to-server requests and Render health checks do not send Origin.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("This origin is not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
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
app.use("/api/admin", adminRouter);

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
