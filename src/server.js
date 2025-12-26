import dotenv from "dotenv";
dotenv.config();  // phải đứng trên mongoose.connect

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
