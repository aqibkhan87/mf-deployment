import React from "react";
import ReactDOM from "react-dom/client";
import { createMemoryHistory, createBrowserHistory } from "history";
import { ProductProvider } from "store/productContext";
import App from "./app";

console.info("Hi Checkout MF");

const roots = new Map();
let history = null;

const mount = (
  el,
  { updateParentHistory, defaultHistory, initialPath = "/" }
) => {
  history = defaultHistory;

  if (updateParentHistory) {
    console.log("updateParentHistory", history);
    history.listen(updateParentHistory);
  }

  const existingRoot = roots.get(el);

  if (existingRoot) {
    // Defer unmount to next tick to avoid sync unmount during render
    setTimeout(() => {
      existingRoot.unmount();
      roots.delete(el);

      const root = ReactDOM.createRoot(el);
      roots.set(el, root);

      root.render(
        <ProductProvider>
          <App history={history} />
        </ProductProvider>
      );
    }, 0);

    return {
      updateChildHistory: () => {},
    };
  }

  const root = ReactDOM.createRoot(el);
  roots.set(el, root);

  root.render(
    <ProductProvider>
      <App history={history} />
    </ProductProvider>
  );

  return {
    updateChildHistory({ pathname: nextPathname }) {
      console.log(
        "history.location.pathname !== nextPathname",
        history.location.pathname,
        nextPathname
      );
      
      if (history.location.pathname !== nextPathname) {
        console.log("inside condition");
        history.push(nextPathname);
      }
    },
  };
};

// For development in isolation - use browser history
if (process.env.NODE_ENV === "development") {
  const devRoot = document.getElementById("_checkout-dev-root");
  if (devRoot) {
    mount(devRoot, { defaultHistory: createBrowserHistory() });
  }
}

export { mount };
