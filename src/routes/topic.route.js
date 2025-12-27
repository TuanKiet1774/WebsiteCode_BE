import express from "express";
import {
  createTopic,
  getTopics,
  getTopicBySlug,
  updateTopic,
  deleteTopic
} from "../controllers/topic.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTopic);          // Create
router.get("/", protect, getTopics);             // Read all
router.get("/:slug", protect, getTopicBySlug);   // Read one
router.put("/:id", protect, updateTopic);        // Update
router.delete("/:id", protect, deleteTopic);     // Delete

export default router;
