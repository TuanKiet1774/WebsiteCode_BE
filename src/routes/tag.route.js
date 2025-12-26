import express from "express";
import {
  createTag,
  getTags,
  getTagBySlug,
  updateTag,
  deleteTag
} from "../controllers/tag.controller.js";

const router = express.Router();

router.post("/", createTag);          // Create
router.get("/", getTags);             // Read all
router.get("/:slug", getTagBySlug);   // Read one
router.put("/:id", updateTag);        // Update
router.delete("/:id", deleteTag);     // Delete

export default router;
