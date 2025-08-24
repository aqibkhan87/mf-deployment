import React, { useContext } from "react";
import { ProductContext } from "store/productContext";

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist } = useContext(ProductContext);

  return (
    <div className="border rounded-lg p-4 shadow-md flex flex-col gap-2">
      <h3 className="font-bold">{product.name}</h3>
      <p>${product.price}</p>
      <div className="flex gap-2">
        <button onClick={() => addToCart(product)} className="bg-blue-500 text-white px-2 py-1 rounded">
          Add to Cart
        </button>
        <button onClick={() => addToWishlist(product)} className="bg-gray-500 text-white px-2 py-1 rounded">
          Wishlist
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
