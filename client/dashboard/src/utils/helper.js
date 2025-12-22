export const eventEmitter = (eventName, eventData) => {
  const customEvent = new CustomEvent(eventName, {
    detail: eventData,
  });
  window.dispatchEvent(customEvent);
};

export const eventRemover = (eventName, eventData) => {
  const customEvent = new CustomEvent(eventName, {
    detail: eventData,
  });
  window.dispatchEvent(customEvent);
};

export const debounce = (fn, delay = 400) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const numberStyle = (active) => ({
  width: 28,
  height: 28,
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontWeight: 600,
  backgroundColor: active ? "#3B82F6" : "#fff",
  color: active ? "#fff" : "#333",
  boxShadow: active
    ? "0 4px 12px rgba(59,130,246,0.4)"
    : "0 1px 4px rgba(0,0,0,0.1)",
  border: "1px solid #E0E0E0",
});
