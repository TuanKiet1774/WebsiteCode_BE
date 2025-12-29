import Code from "../models/code.js";
import Tag from "../models/tag.js";
import Topic from "../models/topic.js";

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
export const searchCodes = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const regex = new RegExp(keyword, "i");

    // 🔍 Tìm tag & topic theo keyword
    const tags = await Tag.find({ name: regex }).select("_id");
    const topics = await Topic.find({ name: regex }).select("_id");

    const tagIds = tags.map(tag => tag._id);
    const topicIds = topics.map(topic => topic._id);

    // 🔎 Tìm code
    const codes = await Code.find({
      $or: [
        { title: regex },
        { languageCode: regex },
        { tags: { $in: tagIds } },
        { topics: { $in: topicIds } }
      ]
    })
      .populate("tags", "name")
      .populate("topics", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: codes.length,
      data: codes
    });
  } catch (err) {
    next(err);
  }
};

