import mongoose from "mongoose";
const Schema = mongoose.Schema;
import CartItemSchema from "./e-cart-item.js";

const cartSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      default: "anonymous",
    },
    products: [CartItemSchema],
    savedAmount: {
      type: String,
    },
    totalAmount: {
      type: String,
    },
    totalActual: {
      type: String,
    },
  },
  {
    collection: "cart", // exact collection name you want
  }
);

const CartModel = mongoose.model("cart", cartSchema);
export default CartModel;
