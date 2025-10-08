export const eventEmitter = (eventName, eventData) => {
  const customEvent = new CustomEvent(eventName, {
    detail: eventData,
  });
  window.dispatchEvent(customEvent);
};

export const updateQuantity = (
  categoryid,
  productid,
  products,
  operation = "add"
) => {
  return products?.map((pro) => {
    if (pro?.productDetail?.categoryid === categoryid && pro?.productDetail?._id === productid) {
      if (operation === "add") {
        pro.quantity = pro?.quantity ? pro?.quantity + 1 : 1;
      } else if (operation === "subtract") {
        pro.quantity = pro?.quantity ? pro?.quantity - 1 : 1;
      }
      return pro;
    }
    return pro;
  });
};
