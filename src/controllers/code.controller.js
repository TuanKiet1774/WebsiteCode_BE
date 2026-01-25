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
    const { topic, tag, search, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (topic) filter.topics = topic;
    if (tag) filter.tags = tag;

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSearch, "i");

      // Tìm các topics/tags phù hợp với keyword
      const [matchedTopics, matchedTags] = await Promise.all([
        Topic.find({ name: regex }).select("_id"),
        Tag.find({ name: regex }).select("_id")
      ]);

      filter.$or = [
        { title: regex },
        { slug: regex },
        { description: regex },
        { languageCode: regex },
        { topics: { $in: matchedTopics.map(t => t._id) } },
        { tags: { $in: matchedTags.map(t => t._id) } }
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const codes = await Code.find(filter)
      .populate("topics", "name slug")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Code.countDocuments(filter);

    res.json({ total, page: pageNum, limit: limitNum, codes });
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
    let {
      page = 1,
      limit = 10,
      search = "",
      topic = "",
      tag = "",
      isFree = "",
    } = req.query;

    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const filter = {};

    /* ================= SEARCH ================= */
    if (search.trim()) {
      const regex = new RegExp(search, "i");

      const [tags, topics] = await Promise.all([
        Tag.find({ name: regex }).select("_id"),
        Topic.find({ name: regex }).select("_id"),
      ]);

      filter.$or = [
        { title: regex },
        { languageCode: regex },
        { tags: { $in: tags.map((t) => t._id) } },
        { topics: { $in: topics.map((t) => t._id) } },
      ];
    }

    /* ================= FILTER TAG ================= */
    if (tag) {
      const tagDoc = await Tag.findOne({ name: tag });
      if (tagDoc) {
        filter.tags = tagDoc._id;
      }
    }

    /* ================= FILTER TOPIC ================= */
    if (topic) {
      const topicDoc = await Topic.findOne({ name: topic });
      if (topicDoc) {
        filter.topics = topicDoc._id;
      }
    }

    /* ================= FILTER FREE ================= */
    if (isFree !== "") {
      filter.isFree = isFree === "true";
    }

    /* ================= QUERY ================= */
    const total = await Code.countDocuments(filter);

    const codes = await Code.find(filter)
      .select(
        "title slug previewImages isFree demoUrl tags topics createdAt languageCode",
      )
      .populate("tags", "name")
      .populate("topics", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page,
      limit,
      data: codes,
    });
  } catch (err) {
    next(err);
  }
};


