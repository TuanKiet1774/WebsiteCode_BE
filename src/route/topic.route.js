import express from "express";
import {
  createTopic,
  getTopics,
  getTopicBySlug,
  updateTopic,
  deleteTopic
} from "../controllers/topic.controller.js";

const router = express.Router();

router.post("/", createTopic);          // Create
router.get("/", getTopics);             // Read all
router.get("/:slug", getTopicBySlug);   // Read one
router.put("/:id", updateTopic);        // Update
router.delete("/:id", deleteTopic);     // Delete

export default router;
