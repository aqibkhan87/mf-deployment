import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productCategorySchema = new Schema(
  {
    categoryid: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true,
        default: []
      },
    ],
  },
  {
    collection: "productCategory", // exact collection name you want
  }
);

const ProductCategoryModel = mongoose.model(
  "productCategory",
  productCategorySchema
);
export default ProductCategoryModel;
