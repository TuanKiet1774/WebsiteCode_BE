import Topic from "../models/topic.js";

/* ===========================
   CREATE TOPIC
   POST /api/topics
=========================== */
export const createTopic = async (req, res) => {
  try {
    const { name, slug, description, order, isActive } = req.body;

    const topic = await Topic.create({
      name,
      slug,
      description,
      order,
      isActive,
    });

    res.status(201).json(topic);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Topic slug already exists",
      });
    }

    res.status(400).json({
      message: err.message,
    });
  }
};

/* ===========================
   GET TOPICS (PAGINATION)
   GET /api/topics?page=1&limit=5&q=&active=true
=========================== */
export const getTopics = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const keyword = req.query.q || "";
    const active = req.query.active;

    const filter = {};

    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }

    if (active !== undefined) {
      filter.isActive = active === "true";
    }

    const [topics, total] = await Promise.all([
      Topic.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Topic.countDocuments(filter),
    ]);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: topics,
    });
  } catch (err) {
    res.status(500).json({
      message: "Fetch topics failed",
      error: err.message,
    });
  }
};

/* ===========================
   GET TOPIC BY SLUG
   GET /api/topics/:slug
=========================== */
export const getTopicBySlug = async (req, res) => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug });

    if (!topic) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    res.status(200).json(topic);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ===========================
   UPDATE TOPIC
   PUT /api/topics/:id
=========================== */
export const updateTopic = async (req, res) => {
  try {
    const { name, slug, description, order, isActive } = req.body;

    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      { name, slug, description, order, isActive },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!topic) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    res.status(200).json(topic);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Topic slug already exists",
      });
    }

    res.status(400).json({
      message: err.message,
    });
  }
};

/* ===========================
   DELETE TOPIC
   DELETE /api/topics/:id
=========================== */
export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);

    if (!topic) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    res.status(200).json({
      message: "Topic deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
