import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", createUser);        // CREATE
router.get("/", getUsers);           // READ ALL
router.get("/:id", getUserById);      // READ ONE
router.put("/:id", updateUser);       // UPDATE
router.delete("/:id", deleteUser);    // DELETE

export default router;
