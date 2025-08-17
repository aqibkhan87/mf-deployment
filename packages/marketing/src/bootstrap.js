import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";

console.info("Hi Marketing MF");

const mount = (el) => {
  const root = ReactDOM.createRoot(el);
  root.render(<App />);
};

// if we are in development and in isolation
// call the mount immediately
if (process.env.NODE_ENV === "development") {
  const devRoot = document.getElementById("_marketing-dev-root");
  if (devRoot) {
    mount(devRoot);
  }
}
// if we are running through container
// and we should export the mount function

export { mount };
