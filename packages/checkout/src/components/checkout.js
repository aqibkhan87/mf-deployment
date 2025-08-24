import React, { useContext, useState } from "react";
import { ProductContext } from "store/productContext";
import Cart from "../components/cart";
import Addons from "../components/addons";
import Recommendations from "../components/recommendations";
import CheckoutForm from "../components/checkoutForm";

const Checkout = () => {
  const { cart, products } = useContext(ProductContext);
  const [addons, setAddons] = useState([]);

  const handleAddonSelect = (addon, checked) => {
    setAddons((prev) => checked ? [...prev, addon] : prev.filter((a) => a.id !== addon.id));
  };

  const total = cart?.reduce((acc, item) => acc + item.price, 0) + addons?.reduce((acc, a) => acc + a.price, 0);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Cart />
      <div>
        <Addons onAddonSelect={handleAddonSelect} />
        <Recommendations products={products} />
        <CheckoutForm total={total} />
      </div>
    </div>
  );
};

export default Checkout;
