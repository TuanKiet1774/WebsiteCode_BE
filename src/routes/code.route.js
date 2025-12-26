import express from "express";
import {
  createCode,
  getCodes,
  getCodeBySlug,
  updateCode,
  deleteCode,
  searchCodes
} from "../controllers/code.controller.js";

const router = express.Router();

router.post("/", createCode);          // Create
router.get("/", getCodes);             // Read all
router.get("/search", searchCodes);    // Search
router.get("/:slug", getCodeBySlug);   // Read one
router.put("/:id", updateCode);        // Update
router.delete("/:id", deleteCode);     // Delete

export default router;
