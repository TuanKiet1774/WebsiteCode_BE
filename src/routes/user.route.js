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

/**
 * USER ROUTES
 * /api/users
 */

// CREATE user (thường chỉ admin dùng)
// router.post("/", protect, createUser);
router.post("/", createUser);

// READ all users
router.get("/", protect, getUsers);

// READ one user
router.get("/:id", protect, getUserById);

// UPDATE user
router.put("/:id", protect, updateUser);

// DELETE user
router.delete("/:id", protect, deleteUser);

export default router;
