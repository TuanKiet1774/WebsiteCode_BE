import express from "express";
import {
  createCode,
  getCodes,
  getCodeBySlug,
  updateCode,
  deleteCode,
  searchCodes
} from "../controllers/code.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createCode);          // Create
router.get("/", protect, getCodes);             // Read all
router.get("/search", protect, searchCodes);    // Search
router.get("/:slug", protect, getCodeBySlug);   // Read one
router.put("/:id", protect, updateCode);        // Update
router.delete("/:id", protect, deleteCode);     // Delete

export default router;
