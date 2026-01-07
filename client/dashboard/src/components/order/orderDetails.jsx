import React from "react";

const OrderDetails = ({ order, cart }) => {
  return (
    <div className="order-details">
      {cart?.products?.map((item) => {
        const p = item.productDetail;
        const actual = Number(p.actualPrice);
        const selling = Number(p.price);
        const qty = item.quantity;

        return (
          <div key={item._id} className="product-row">
            <div className="flex">
              <div>
                <img src={p?.productImage} alt={p.name} />
              </div>
              <div className="info">
                <h4>{p?.name}</h4>
                <p>Seller: {p.seller}</p>
                <p>Qty: {qty}</p>
              </div>
            </div>

            <div className="price">
              <p>₹{selling} × {qty}</p>
              <p className="mrp">₹{actual * qty}</p>
              <p className="saved">
                Saved ₹{(actual - selling) * qty}
              </p>
            </div>
          </div>
        );
      })}

      {/* TOTALS */}
      <div className="order-total">
        <div>
          <span>Total MRP:</span>
          <span>₹{cart.totalActual}</span>
        </div>

        <div>
          <span>Discount:</span>
          <span className="saved">-₹{cart?.savedAmount}</span>
        </div>

        <div className="payable">
          <strong>Paid Amount:</strong>
          <strong>₹{cart?.totalAmount}</strong>
        </div>
      </div>

      {/* PAYMENT INFO */}
      <div className="payment-info">
        <p>Payment Mode: {order.gateway}</p>
        <p>Currency: {order.currency}</p>
        {order.razorpay_order_id && (
          <p>Razorpay Order ID: {order.razorpay_order_id}</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
