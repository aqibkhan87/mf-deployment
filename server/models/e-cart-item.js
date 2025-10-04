import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  productDetail: {
    type: Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

export default CartItemSchema;
