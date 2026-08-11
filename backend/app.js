import express from "express";
import cors from "cors";
import path from "path";

import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import Category from "./routes/category.routes.js";

const app = express();

// ========================================
// CORS
// ========================================

app.use(
  cors({
    origin: "http://localhost:5173",

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    credentials: true,
  })
);

// ========================================
// BODY PARSER
// ========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ========================================
// STATIC UPLOADS
// ========================================

// uploads folder ko public bana rahe hain

app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

// ========================================
// ROUTES
// ========================================

app.use("/api/auth", authRouter);

app.use("/api/products", productRouter);

app.use("/api/category", Category);

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