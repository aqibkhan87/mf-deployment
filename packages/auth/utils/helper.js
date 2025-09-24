
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