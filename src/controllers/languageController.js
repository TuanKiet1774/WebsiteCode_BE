import { Language } from "../models/language.js";

// GET all languages
export const getLanguages = async (req, res) => {
  try {
    const languages = await Language.find().sort({ name: 1 });
    res.json(languages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single language by ID
export const getLanguage = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) return res.status(404).json({ message: "Language not found" });
    res.json(language);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE new language
export const createLanguage = async (req, res) => {
  try {
    const { name } = req.body;
    const language = new Language({ name });
    await language.save();
    res.status(201).json(language);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE language by ID
export const updateLanguage = async (req, res) => {
  try {
    const { name } = req.body;
    const language = await Language.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!language) return res.status(404).json({ message: "Language not found" });
    res.json(language);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE language by ID
export const deleteLanguage = async (req, res) => {
  try {
    const language = await Language.findByIdAndDelete(req.params.id);
    if (!language) return res.status(404).json({ message: "Language not found" });
    res.json({ message: "Language deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
