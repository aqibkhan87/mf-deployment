import React from "react";

const Addons = ({ onAddonSelect }) => {
  const addons = [
    { id: "gift", name: "Gift Wrap", price: 5 },
    { id: "warranty", name: "Extended Warranty", price: 49 },
    { id: "priority", name: "Priority Shipping", price: 15 }
  ];

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Add-ons</h3>
      {addons.map((a) => (
        <div key={a.id} className="flex justify-between">
          <label>
            <input type="checkbox" onChange={(e) => onAddonSelect(a, e.target.checked)} />
            {a.name}
          </label>
          <span>${a.price}</span>
        </div>
      ))}
    </div>
  );
};

export default Addons;
