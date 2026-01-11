import Tag from "../models/tag.js";

/* ===========================
   CREATE TAG
   POST /api/tags
=========================== */
export const createTag = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const tag = await Tag.create({
      name,
      slug,
    });

    res.status(201).json(tag);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Tag name or slug already exists",
      });
    }

    res.status(400).json({
      message: err.message,
    });
  }
};

/* ===========================
   GET TAGS (PAGINATION)
   GET /api/tags?page=1&limit=5&q=
=========================== */
export const getTags = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const keyword = req.query.q || "";

    const filter = keyword ? { name: { $regex: keyword, $options: "i" } } : {};

    const [tags, total] = await Promise.all([
      Tag.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),

      Tag.countDocuments(filter),
    ]);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: tags,
    });
  } catch (err) {
    res.status(500).json({
      message: "Fetch tags failed",
      error: err.message,
    });
  }
};

/* ===========================
   GET TAG BY SLUG
   GET /api/tags/:slug
=========================== */
export const getTagBySlug = async (req, res) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });

    if (!tag) {
      return res.status(404).json({
        message: "Tag not found",
      });
    }

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ===========================
   UPDATE TAG
   PUT /api/tags/:id
=========================== */
export const updateTag = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tag) {
      return res.status(404).json({
        message: "Tag not found",
      });
    }

    res.status(200).json(tag);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Tag name or slug already exists",
      });
    }

    res.status(400).json({
      message: err.message,
    });
  }
};

/* ===========================
   DELETE TAG
   DELETE /api/tags/:id
=========================== */
export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({
        message: "Tag not found",
      });
    }

    res.status(200).json({
      message: "Tag deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
