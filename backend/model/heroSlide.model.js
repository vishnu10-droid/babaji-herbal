import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    to: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    imageFileId: {
      type: String,
      default: "",
    },

    position: {
      type: String,
      default: "center",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const HeroSlide = mongoose.model("HeroSlide", heroSlideSchema);

export default HeroSlide;