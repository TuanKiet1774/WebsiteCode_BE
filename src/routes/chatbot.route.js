import express from "express";
import {
  chatWithGift,
  getChatConfig,
  updateChatConfig,
} from "../controllers/chatbot.controller.js";

const router = express.Router();

// Chat với Gift-Con
router.post("/chat", chatWithGift);

// Lấy cấu hình chatbot
router.get("/config", getChatConfig);

// Cập nhật cấu hình chatbot
router.put("/config", updateChatConfig);

export default router;
