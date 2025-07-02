import React from "react";
import ReactDom from "react-dom";
import App from "./app";

console.log("Hi Dashboard MF");

const mount = (el) => {
  ReactDom.render(<App />, el);
};

// if we are in development and in isolation
// call the mount immediately
if (process.env.NODE_ENV === "development") {
  const devRoot = document.getElementById("_dashboard-dev-root");
  if (devRoot) {
    mount(devRoot);
  }
}
// if we are running through container
// and we should export the mount function

export { mount };
