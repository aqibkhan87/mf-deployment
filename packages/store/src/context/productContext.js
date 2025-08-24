import React, { createContext, useState, useEffect } from "react";
import { productsData } from "../utils/products";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products] = useState(productsData);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("wishlist")) || []);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem("orders")) || []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [cart, wishlist, orders]);

  const addToCart = (item) => setCart([...cart, item]);
  const removeFromCart = (id) => setCart(cart.filter((p) => p.id !== id));
  const addToWishlist = (item) => setWishlist([...wishlist, item]);
  const placeOrder = (order) => setOrders([...orders, order]);

  return (
    <ProductContext.Provider
      value={{ products, cart, wishlist, orders, addToCart, removeFromCart, addToWishlist, placeOrder }}
    >
      {children}
    </ProductContext.Provider>
  );
};
