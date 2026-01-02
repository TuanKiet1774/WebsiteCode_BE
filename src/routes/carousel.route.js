// routes/carousel.route.js
import express from "express";
import {
  createCarousel,
  getAllCarousels,
  getCarouselById,
  updateCarousel,
  deleteCarousel
} from "../controllers/carousel.controller.js"; // controllers bạn sẽ tạo

const router = express.Router();

router.post("/", createCarousel);          // CREATE
router.get("/", getAllCarousels);         // READ ALL
router.get("/:id", getCarouselById);      // READ ONE
router.put("/:id", updateCarousel);       // UPDATE
router.delete("/:id", deleteCarousel);    // DELETE

export default router;
