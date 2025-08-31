import React, { createContext, useState, useEffect } from "react";
import { productsCategoriesData } from "../utils/products";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productsCategories] = useState(productsCategoriesData || []);
  
  const [wishlist, setWishlist] = useState(
    () => JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const [orders, setOrders] = useState(
    () => JSON.parse(localStorage.getItem("orders")) || []
  );

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [wishlist, orders]);

  const removeFromCart = (id) => setCart(cart.filter((p) => p.id !== id));
  const addToWishlist = (item) => setWishlist([...wishlist, item]);
  const placeOrder = (order) => setOrders([...orders, order]);

  return (
    <ProductContext.Provider
      value={{
        productsCategories,
        wishlist,
        orders,
        removeFromCart,
        addToWishlist,
        placeOrder,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
