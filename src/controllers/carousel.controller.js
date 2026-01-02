import express from "express";
import Carousel from "../models/carousel.js"; // đường dẫn tới file schema

const router = express.Router();

// -------------------- CREATE --------------------
router.post("/", async (req, res) => {
  try {
    const { title, imgUrl, description } = req.body;

    const carousel = new Carousel({
      title,
      imgUrl,
      description
    });

    const savedCarousel = await carousel.save();
    res.status(201).json(savedCarousel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -------------------- READ ALL --------------------
router.get("/", async (req, res) => {
  try {
    const carousels = await Carousel.find().sort({ createdAt: -1 });
    res.json(carousels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -------------------- READ ONE --------------------
router.get("/:id", async (req, res) => {
  try {
    const carousel = await Carousel.findById(req.params.id);
    if (!carousel) return res.status(404).json({ message: "Carousel not found" });
    res.json(carousel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -------------------- UPDATE --------------------
router.put("/:id", async (req, res) => {
  try {
    const { title, imgUrl, description } = req.body;
    const updatedCarousel = await Carousel.findByIdAndUpdate(
      req.params.id,
      { title, imgUrl, description },
      { new: true, runValidators: true }
    );

    if (!updatedCarousel) return res.status(404).json({ message: "Carousel not found" });
    res.json(updatedCarousel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -------------------- DELETE --------------------
router.delete("/:id", async (req, res) => {
  try {
    const deletedCarousel = await Carousel.findByIdAndDelete(req.params.id);
    if (!deletedCarousel) return res.status(404).json({ message: "Carousel not found" });
    res.json({ message: "Carousel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
