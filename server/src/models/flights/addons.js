import mongoose from "mongoose";

const AddonsProductSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["meal", "baggage", "extra"],
      required: true,
      index: true,
    },

    code: {
      type: String,
      required: true,
      unique: true, // m-veg, bag-5, sports
    },

    title: {
      type: String,
      required: true,
    },

    description: String,

    price: {
      type: Number,
      required: true,
    },

    tag: String, // Veg / Non-Veg / Kg etc

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "addons" }
);

export default mongoose.model("AddonsProduct", AddonsProductSchema);
