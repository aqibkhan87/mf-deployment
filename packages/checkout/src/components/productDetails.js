import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductContext } from "store/productContext";
import Recommendations from "./recommendations";

const ProductDetail = () => {
  const { id } = useParams();
  const { products, addToCart, addToWishlist } = useContext(ProductContext);

  const product = products?.find((p) => p.id.toString() === id);

  if (!product) return <p className="p-4">Product not found</p>;

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      {/* Image placeholder */}
      <div className="flex items-center justify-center bg-gray-100 h-64 rounded-lg">
        <span className="text-gray-500">[ Image Placeholder ]</span>
      </div>

      {/* Product Info */}
      <div>
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-lg text-gray-700 mb-4">${product.price}</p>
        <p className="text-gray-600 mb-4">
          This is a detailed description of the product. You can replace this with real content.
        </p>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => addToCart(product)} 
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add to Cart
          </button>
          <button 
            onClick={() => addToWishlist(product)} 
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Wishlist
          </button>
        </div>

        <Link to="/checkout" className="text-green-600 underline">Go to Checkout</Link>
      </div>

      {/* Recommendations */}
      <div className="col-span-2 mt-6">
        <Recommendations products={products.filter((p) => p.id !== product.id)} />
      </div>
    </div>
  );
};

export default ProductDetail;
