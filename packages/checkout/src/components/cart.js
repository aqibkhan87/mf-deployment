import React, { useContext } from "react";
import { ProductContext } from "store/productContext";

const Cart = () => {
  const productContext = useContext(ProductContext);
  console.log("productContext in cart", productContext)
  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-2">Cart</h2>
      {productContext?.cart?.length === 0 ? <p>No items in cart</p> : (
        productContext?.cart?.map((item) => (
          <div key={item.id} className="flex justify-between border-b py-2">
            <span>{item.name}</span>
            <span>${item.price}</span>
            <button onClick={() => productContext?.removeFromCart(item.id)} className="text-red-500">Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
