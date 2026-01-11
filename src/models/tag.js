import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
);

tagSchema.index({ createdAt: -1 });
tagSchema.index({ name: 1});
tagSchema.index({ slug: 1 });

export default mongoose.model("Tag", tagSchema);
