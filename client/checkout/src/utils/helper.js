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

export const formatDuration = (duration) => {
    const hrs = duration.match(/(\d+)H/);
    const mins = duration.match(/(\d+)M/);
    return `${hrs ? hrs[1] + "h " : ""}${mins ? mins[1] + "m" : ""}`.trim();
};

export const getTimeDifference = (smallerDate, largerDate) => {
  const start = new Date(smallerDate);
  const end = new Date(largerDate);

  const diffMs = Math.abs(end - start); // in milliseconds
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours ? `${hours}h` : ""} ${minutes ? `${minutes}m` : ""}`;
}

export const downloadFile = (url) => {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.download = "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};