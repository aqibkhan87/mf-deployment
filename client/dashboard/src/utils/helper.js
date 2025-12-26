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

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const formatDuration = (duration) => {
    const hrs = duration?.match(/(\d+)H/);
    const mins = duration?.match(/(\d+)M/);
    return `${hrs ? hrs[1] + "h " : ""}${mins ? mins[1] + "m" : ""}`.trim();
};

export const getTimeDifference = (smallerDate, largerDate) => {
  const start = new Date(smallerDate);
  const end = new Date(largerDate);

  const diffMs = Math.abs(end - start); // in milliseconds
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  console.log(hours, "minutes", minutes)

  return `${hours ? `${hours}h` : ""} ${minutes ? `${minutes}m` : ""}`;
}