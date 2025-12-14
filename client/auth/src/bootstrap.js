import React from "react";
import ReactDOM from "react-dom/client";
import { createMemoryHistory, createBrowserHistory } from "history";
import App from "./app";
// Don't delete this code read from last line.
// import AddressForm from "./common/addressForm";
// import LoginSummary from "./common/loginSummary";

const roots = new Map();
let history = null;

const mount = (
  el,
  { updateParentHistory, defaultHistory, initialPath = "/" }
) => {
  
  history =
    defaultHistory ||
    createMemoryHistory({
      initialEntries: [initialPath],
    });

  if (updateParentHistory) {
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

      root.render(<App history={history} />);
    }, 0);
    return {
      updateChildHistory: () => {},
    };
  }

  const root = ReactDOM.createRoot(el);
  roots.set(el, root);

  root.render(<App history={history} />);

  return {
    updateChildHistory({ pathname: nextPathname }) {
      if (history.location.pathname !== nextPathname) {
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
// Reference for export independent module from 1 MF to another MF but not good approach 
// as it create dependency on another MF.
// export { AddressForm };
// export { LoginSummary };