import React from "react";
import { useCartStore } from "store/cartStore";

const Wishlist = () => {
  const { wishlist } = useCartStore();

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-2">Wishlist</h2>
      {wishlist?.length === 0 ? <p>No items in wishlist</p> : (
        wishlist?.map((item) => (
          <div key={item.id} className="flex justify-between border-b py-2">
            <span>{item.name}</span>
            <span>${item.price}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;
