import Carousel from "../models/carousel.js";

/* ===========================
   CREATE CAROUSEL
   POST /api/carousels
=========================== */
export const createCarousel = async (req, res) => {
  try {
    const { title, imgUrl, description = "", isHot = true } = req.body;

    if (!title || !imgUrl) {
      return res.status(400).json({
        message: "Title and imgUrl are required",
      });
    }

    const carousel = await Carousel.create({
      title,
      imgUrl,
      description,
      isHot,
    });

    res.status(201).json(carousel);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   GET CAROUSELS (SEARCH + PAGINATION)
   GET /api/carousels?page=1&limit=5&q=
=========================== */
export const getCarousels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const keyword = req.query.q || "";

    const filter = keyword ? { title: { $regex: keyword, $options: "i" } } : {};

    const [carousels, total] = await Promise.all([
      Carousel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Carousel.countDocuments(filter),
    ]);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: carousels,
    });
  } catch (error) {
    res.status(500).json({
      message: "Fetch carousels failed",
      error: error.message,
    });
  }
};

/* ===========================
   GET CAROUSEL BY ID
   GET /api/carousels/:id
=========================== */
export const getCarouselById = async (req, res) => {
  try {
    const carousel = await Carousel.findById(req.params.id);

    if (!carousel) {
      return res.status(404).json({
        message: "Carousel not found",
      });
    }

    res.status(200).json(carousel);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   UPDATE CAROUSEL
   PUT /api/carousels/:id
=========================== */
export const updateCarousel = async (req, res) => {
  try {
    const { title, imgUrl, description, isHot } = req.body;

    const carousel = await Carousel.findByIdAndUpdate(
      req.params.id,
      { title, imgUrl, description, isHot },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!carousel) {
      return res.status(404).json({
        message: "Carousel not found",
      });
    }

    res.status(200).json(carousel);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/* ===========================
   DELETE CAROUSEL
   DELETE /api/carousels/:id
=========================== */
export const deleteCarousel = async (req, res) => {
  try {
    const carousel = await Carousel.findByIdAndDelete(req.params.id);

    if (!carousel) {
      return res.status(404).json({
        message: "Carousel not found",
      });
    }

    res.status(200).json({
      message: "Carousel deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
