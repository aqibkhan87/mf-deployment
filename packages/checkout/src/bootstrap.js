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
  history =
    defaultHistory || createMemoryHistory({ initialEntries: [initialPath] });

  if (updateParentHistory) {
    history.listen((location) => {
      console.log("in Child MF TO LISTEN FOR PARENT ROUTE", location);
      updateParentHistory(location);
    });
  }

  const existingRoot = roots.get(el);

  if (existingRoot) {
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
      updateChildHistory: ({ pathname: nextPathname }) => {
        debugger;
        if (history.location.pathname !== nextPathname) {
          history.push(nextPathname);
        }
      },
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
      debugger;
      if (history.location.pathname !== nextPathname) {
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
