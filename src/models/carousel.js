import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    imgUrl: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Carousel", carouselSchema);
