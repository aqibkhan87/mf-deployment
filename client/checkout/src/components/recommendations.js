import React from "react";

const Recommendations = ({ products }) => (
  <div className="p-4 border rounded">
    <h3 className="font-bold mb-2">Recommended for you</h3>
    <div className="flex gap-2">
      {products?.slice(0, 2)?.map((p, i) => (
        <div key={`index-${i}`} className="p-2 border rounded">
          <span>{p?.name}</span> - <span>${p?.price}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Recommendations;
