import React from "react";
import ReactDOM from "react-dom/client";
import { createMemoryHistory, createBrowserHistory } from "history";
import App from "./app";

console.info("Hi Auth MF");

const mount = (el, { onNavigate, defaultHistory, initialPath }) => {
  console.log("initialPath - mount", initialPath, "defaultHistory", defaultHistory);
  const history =
    defaultHistory ||
    createMemoryHistory({
      initialEntries: [initialPath || "/"],
    });

  if(onNavigate) {
    history.listen(onNavigate);
  }  

  const root = ReactDOM.createRoot(el);
  root.render(
    <App
      onNavigate={onNavigate}
      defaultHistory={history}
      initialPath={initialPath}
    />
  );
  return {
    onParentNavigate({ pathname: nextPathname }) {
      const { pathname } = history.location;

      if (pathname !== nextPathname) {
        history.push(nextPathname); // 🔹 Update child’s memory router
      }
    },
  };
};

// if we are in development and in isolation
// call the mount immediately
if (process.env.NODE_ENV === "development") {
  const devRoot = document.getElementById("_auth-dev-root");
  if (devRoot) {
    mount(devRoot, { defaultHistory: createBrowserHistory() });
  }
}
// if we are running through dashboard
// and we should export the mount function

export { mount };
