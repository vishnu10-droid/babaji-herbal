import express from "express";
import cors from "cors";
import path from "path";

import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import Category from "./routes/category.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import { Contact } from "lucide-react";
import contactRouter from "./routes/contact.routes.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
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

// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is running",
  });
});

export default app;
