import express from "express";
import {
  createCarousel,
  getCarousels, 
  getCarouselById,
  updateCarousel,
  deleteCarousel,
} from "../controllers/carousel.controller.js";

const router = express.Router();
router.post("/", createCarousel);
router.get("/", getCarousels);
router.get("/:id", getCarouselById);
router.put("/:id", updateCarousel);
router.delete("/:id", deleteCarousel);

export default router;
