import mongoose from "mongoose";

const codeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
    },

    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: true,
      },
    ],

    languageCode: {
      type: String,
      default: "",
    },

    previewImages: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      default: "",
    },

    demoUrl: {
      type: String,
      default: "",
    },

    githubUrl: {
      type: String,
      default: "",
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    isFree: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

codeSchema.index({
  title: "text",
  languageCode: "text",
  description: "text",
});

export default mongoose.model("Code", codeSchema);
