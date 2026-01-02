import Carousel from "../models/carousel.js";

// CREATE
export const createCarousel = async (req, res) => {
  try {
    const { title, imgUrl, description } = req.body;
    if (!title || !imgUrl)
      return res.status(400).json({ message: "Title and imgUrl are required" });

    const newCarousel = new Carousel({ title, imgUrl, description });
    const savedCarousel = await newCarousel.save();
    res.status(201).json(savedCarousel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
export const getAllCarousels = async (req, res) => {
  try {
    const carousels = await Carousel.find().sort({ createdAt: -1 });
    res.json(carousels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
export const getCarouselById = async (req, res) => {
  try {
    const carousel = await Carousel.findById(req.params.id);
    if (!carousel) return res.status(404).json({ message: "Carousel not found" });
    res.json(carousel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateCarousel = async (req, res) => {
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
};

// DELETE
export const deleteCarousel = async (req, res) => {
  try {
    const deletedCarousel = await Carousel.findByIdAndDelete(req.params.id);
    if (!deletedCarousel) return res.status(404).json({ message: "Carousel not found" });
    res.json({ message: "Carousel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
