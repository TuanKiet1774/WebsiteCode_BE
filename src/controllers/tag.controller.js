import Tag from "../models/Tag.js";

/**
 * CREATE tag
 * POST /api/tags
 */
export const createTag = async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (err) {
    // trùng name hoặc slug
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Tag name or slug already exists"
      });
    }
    res.status(400).json({ message: err.message });
  }
};

/**
 * READ all tags
 * GET /api/tags
 */
export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * READ tag by slug
 * GET /api/tags/:slug
 */
export const getTagBySlug = async (req, res) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE tag
 * PUT /api/tags/:id
 */
export const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.json(tag);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Tag name or slug already exists"
      });
    }
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE tag
 * DELETE /api/tags/:id
 */
export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
