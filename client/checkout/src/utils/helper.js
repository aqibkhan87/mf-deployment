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
    if (
      pro?.productDetail?.categoryid === categoryid &&
      pro?.productDetail?._id === productid
    ) {
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

export const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email && emailRegex.test(email);
};

export const isMobileValid = (mobile) => {
  const mobileRegex = /^[0-9]{10}$/;
  return mobile && mobileRegex.test(mobile);
};

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
