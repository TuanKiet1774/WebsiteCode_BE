import Code from "../models/code.js";

/**
 * CREATE Code
 * POST /api/codes
 */
export const createCode = async (req, res) => {
  try {
    const code = await Code.create(req.body);
    res.status(201).json(code);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    res.status(400).json({ message: err.message });
  }
};

/**
 * READ all Codes (pagination + filter)
 * GET /api/codes
 */
export const getCodes = async (req, res) => {
  try {
    const { topic, tag, page = 1, limit = 10 } = req.query;
    const filter = {}; // bỏ isPublished

    if (topic) filter.topics = topic;
    if (tag) filter.tags = tag;

    const codes = await Code.find(filter)
      .populate("topics", "name slug")
      .populate("tags", "name slug") // nếu muốn
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Code.countDocuments(filter);

    res.json({ total, page: Number(page), limit: Number(limit), codes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * READ one Code by slug
 * GET /api/codes/:slug
 */
export const getCodeBySlug = async (req, res) => {
  try {
    const code = await Code.findOne({ slug: req.params.slug })
      .populate("topicId", "name slug");
    if (!code) return res.status(404).json({ message: "Code not found" });

    // tăng views
    code.views += 1;
    await code.save();

    res.json(code);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE Code
 * PUT /api/codes/:id
 */
export const updateCode = async (req, res) => {
  try {
    const code = await Code.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!code) return res.status(404).json({ message: "Code not found" });

    res.json(code);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Slug already exists" });
    }
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE Code
 * DELETE /api/codes/:id
 */
export const deleteCode = async (req, res) => {
  try {
    const code = await Code.findByIdAndDelete(req.params.id);
    if (!code) return res.status(404).json({ message: "Code not found" });

    res.json({ message: "Code deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * SEARCH Code
 * GET /api/codes/search?q=keyword
 */
export const searchCodes = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q) return res.status(400).json({ message: "Query is required" });

    const codes = await Code.find({ $text: { $search: q }, isPublished: true })
      .populate("topicId", "name slug")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Code.countDocuments({ $text: { $search: q }, isPublished: true });

    res.json({ total, page: Number(page), limit: Number(limit), codes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
