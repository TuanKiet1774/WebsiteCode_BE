import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/",protect, createUser);
router.get("/", protect, getUsers);

router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;
