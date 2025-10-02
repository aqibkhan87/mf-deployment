import mongoose from "mongoose";
import ProductModel from "./e-product";
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  cartid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  products: [ProductModel],
  savedAmount: {
    type: String,
    required: true,
  },
  discountedAmount: {
    type: String,
    required: true,
  },
  actualAmount: {
    type: String,
    required: true,
  },
});

const CartModel = mongoose.model("cart", cartSchema);
export default CartModel;
