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

    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: true
      }
    ],

    language: {
      type: String,
      required: true,
      lowercase: true
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
codeSchema.index({ topics: 1 });
codeSchema.index({ tags: 1 });
codeSchema.index({ title: "text", description: "text" });

export default mongoose.model("Code", codeSchema);