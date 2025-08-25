import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { createMemoryHistory, createBrowserHistory } from "history";
const ProductProvider = lazy(() => import("store/productContext").then(m => ({ default: m.ProductProvider })));
import App from "./app";

console.info("Hi Checkout MF");

const mount = (el, { onNavigate, defaultHistory, initialPath }) => {
  const history =
    defaultHistory ||
    createMemoryHistory({
      initialEntries: [initialPath || "/"],
    });

  if (onNavigate) {
    history.listen(onNavigate);
  }

  const root = ReactDOM.createRoot(el);

  const MountWrapper = () => {
    if (onNavigate) {
      return (
        <App
          onNavigate={onNavigate}
          defaultHistory={history}
          initialPath={initialPath}
        />
      );
    }
    return (
      <ProductProvider>
        <App
          onNavigate={onNavigate}
          defaultHistory={history}
          initialPath={initialPath}
        />
      </ProductProvider>
    );
  };
  root.render(<MountWrapper />);

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
  const devRoot = document.getElementById("_checkout-dev-root");
  if (devRoot) {
    mount(devRoot, { defaultHistory: createBrowserHistory() });
  }
}
// if we are running through container
// and we should export the mount function

export { mount };
