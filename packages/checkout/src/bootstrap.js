import React from "react";
import ReactDOM from "react-dom/client";
import { createMemoryHistory, createBrowserHistory } from "history";
import { ProductProvider } from "store/productContext";
import App from "./app";

const mount = (
  el,
  { updateParentHistory, defaultHistory = null, initialPath = "/" }
) => {
  const history =
    defaultHistory || createMemoryHistory({ initialEntries: [initialPath] });

  if (updateParentHistory) {
    history.listen(updateParentHistory);
  }

  const root = ReactDOM.createRoot(el);

  root.render(
    <ProductProvider>
      <App history={history} />
    </ProductProvider>
  );

  return {
    updateChildHistory({ pathname: nextPathname }) {
      console.log(
        "IN CHECKOUT MF updateChildHistory",
        history.location.pathname,
        "nextPathname",
        nextPathname
      );
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
