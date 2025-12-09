import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: "anonymous",
    },
    name: {
      type: String,
      required: true,
    },
    line1: {
      type: String,
    },
    line2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    isDefault: { type: Boolean, default: false },
  },
  {
    collection: "address",
  }
);

const AddressModel = mongoose.model("Address", AddressSchema);
export default AddressModel;
