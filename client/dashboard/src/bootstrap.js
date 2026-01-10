import React from "react";
import ReactDOM from "react-dom/client";
import { createMemoryHistory, createBrowserHistory } from "history";
import App from "./app";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const roots = new Map();
let history = null;

const mount = (
  el,
  { updateParentHistory, defaultHistory = null, initialPath = "/" }
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

      root.render(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App history={history} />
        </LocalizationProvider>
      );
    }, 0);
    return {
      updateChildHistory: () => {},
    };
  }

  const root = ReactDOM.createRoot(el);
  roots.set(el, root);

  root.render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <App history={history} />
    </LocalizationProvider>
  );

  return {
    updateChildHistory({ pathname: nextPathname }) {
      if (history.location.pathname !== nextPathname) {
        history.push(nextPathname);
      }
    },
  };
};

// For development in isolation - use browser history
if (process.env.NODE_ENV === "development") {
  const devRoot = document.getElementById("_dashboard-dev-root");
  if (devRoot) {
    mount(devRoot, {
      initialPath: "/",
      defaultHistory: createBrowserHistory(),
    });
  }
}
// if we are running through dashboard
// and we should export the mount function

export { mount };
