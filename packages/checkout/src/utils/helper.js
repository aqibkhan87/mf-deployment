export const eventEmitter = (eventName, eventData) => {
  const customEvent = new CustomEvent(eventName, {
    detail: eventData,
  });
  window.dispatchEvent(customEvent);
};

export const addQuantity = (categoryid, productid, cart) => {
  return cart?.map((pro) => {
    if (pro?.categoryid === categoryid && pro?.id === productid) {
      pro.quantity = pro?.quantity ? pro?.quantity + 1 : 1;
      return pro;
    }
    return pro;
  });
};

export const subtractQuantity = (categoryid, productid, cart) => {
  return cart?.filter((pro) => {
    if (pro?.categoryid === categoryid && pro?.id === productid) {
      if (pro?.quantity > 1) {
        pro.quantity -= 1;
        return pro;
      }
    } else {
      return pro;
    }
  });
};
