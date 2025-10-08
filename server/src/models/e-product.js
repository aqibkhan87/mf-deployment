import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    categoryid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
    reviews: {
      type: Number,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    seller: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    discountedPrice: {
      type: String,
      required: true,
    },
    actualPrice: {
      type: String,
      required: true,
    },
  },
  {
    collection: "product",  // exact collection name you want
  }
);

const ProductModel = mongoose.model("product", productSchema);
export default ProductModel;
