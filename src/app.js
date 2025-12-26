import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import topicRoutes from "./routes/topic.route.js";
import codeRoutes from "./routes/code.route.js";
import tagRoutes from "./routes/tag.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route test API
app.get("/", (req, res) => {
  res.send("🚀 Code Showcase API is running!");
});

// Routes
app.use("/api/topics", topicRoutes);
app.use("/api/codes", codeRoutes);
app.use("/api/tags", tagRoutes);

// Middleware check if Code is published (optional)
// Sử dụng cho các route GET /api/codes/* nếu muốn lọc tự động
app.use("/api/codes", (req, res, next) => {
  if (!req.query.showUnpublished) {
    req.query.isPublished = true;
  }
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

export default app;
