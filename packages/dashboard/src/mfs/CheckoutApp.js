import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { mount } from "checkout/CheckoutApp";

const CheckoutApp = () => {
  const ref = useRef(null);
  const history = useHistory();

  const updateParentHistory = (childLocation) => {
    const { pathname: childPath } = childLocation?.location ?? childLocation;
    console.log(
      "in dashboard MF childLocation",
      childPath,
      "historyhistory",
      history
    );
    debugger;

    if (childPath !== history?.location.pathname) {
      history.push(childPath);
    }
  };

  // Base paths that child MFs are mounted under
  const basePaths = ["/checkout", "/product", "/cart", "/auth"];

  // Function to get subpath by stripping base path prefix
  const getSubPath = (pathname) => {
    for (const basePath of basePaths) {
      if (pathname.startsWith(basePath)) {
        return pathname.slice(basePath.length) || "/";
      }
    }
    return pathname; // no base path matched (unlikely)
  };

  const subPath = getSubPath(history.location.pathname);

  useEffect(() => {
    const { updateChildHistory } = mount(ref.current, {
      updateParentHistory: updateParentHistory,
      initialPath: subPath,
    });

    const unlisten = history.listen((location) => {
      console.log("location in unlisten from parent Checkout", location);
      updateChildHistory(location);
    });

    return () => unlisten();
  }, [history.location.pathname, history]);

  return <div ref={ref} />;
};

export default CheckoutApp;
