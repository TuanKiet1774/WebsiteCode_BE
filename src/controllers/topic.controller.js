import Topic from "../models/topic.js";

/**
 * CREATE topic
 * POST /api/topics
 */
export const createTopic = async (req, res) => {
  try {
    const topic = await Topic.create(req.body);
    res.status(201).json(topic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * READ all topics
 * GET /api/topics
 */
export const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find()
      .sort({ order: 1, createdAt: -1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * READ topic by slug
 * GET /api/topics/:slug
 */
export const getTopicBySlug = async (req, res) => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug });
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE topic
 * PUT /api/topics/:id
 */
export const updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json(topic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE topic
 * DELETE /api/topics/:id
 */
export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json({ message: "Topic deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
