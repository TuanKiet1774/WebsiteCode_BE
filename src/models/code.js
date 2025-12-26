import mongoose from "mongoose";

const codeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    description: {
      type: String,
      default: ""
    },

    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true
    },

    language: {
      type: String,
      required: true,
      lowercase: true
    },

    code: {
      type: String,
      required: true
    },

    previewImages: [
      {
        type: String
      }
    ],

    demoUrl: {
      type: String,
      default: ""
    },

    githubUrl: {
      type: String,
      default: ""
    },

    tags: [
      {
        type: String,
        lowercase: true
      }
    ],

    views: {
      type: Number,
      default: 0
    },

    likes: {
      type: Number,
      default: 0
    },

    isFree: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

codeSchema.index({ slug: 1 });
codeSchema.index({ topicId: 1 });
codeSchema.index({ tags: 1 });
codeSchema.index({ title: "text", description: "text" });

export default mongoose.model("Code", codeSchema);
