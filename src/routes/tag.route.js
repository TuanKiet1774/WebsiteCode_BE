import express from "express";
import {
  createTag,
  getTags,
  getTagBySlug,
  updateTag,
  deleteTag
} from "../controllers/tag.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTag);          // Create
router.get("/", protect, getTags);             // Read all
router.get("/:slug", protect, getTagBySlug);   // Read one
router.put("/:id", protect, updateTag);        // Update
router.delete("/:id", protect, deleteTag);     // Delete

export default router;
