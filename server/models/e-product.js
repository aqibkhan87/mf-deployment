import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
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
});

const ProductModel = mongoose.model("product", productSchema);
export default ProductModel;
