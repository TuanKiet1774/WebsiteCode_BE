import express from "express";
import {
  getLanguages,
  getLanguage,
  createLanguage,
  updateLanguage,
  deleteLanguage
} from "../controllers/languageController.js";

const router = express.Router();

// Routes
router.get("/", getLanguages);           // GET /api/languages
router.get("/:id", getLanguage);         // GET /api/languages/:id
router.post("/", createLanguage);        // POST /api/languages
router.put("/:id", updateLanguage);      // PUT /api/languages/:id
router.delete("/:id", deleteLanguage);   // DELETE /api/languages/:id

export default router;
