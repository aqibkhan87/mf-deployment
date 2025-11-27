import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { mount } from "checkout/CheckoutApp";

const CheckoutApp = () => {
  const ref = useRef(null);
  const history = useHistory();

  // 🔹 Child → Parent
  const updateParentHistory = (childLocation) => {
    const { pathname: childPath } = childLocation?.location ?? childLocation;
    if (childPath !== history.location.pathname) {
      history.push(childPath); // ✅ no prefixing here
    }
  };

  useEffect(() => {
    const { updateChildHistory } = mount(ref.current, {
      updateParentHistory,
      initialPath: history.location.pathname, // ✅ full path
    });

    // 🔹 Parent → Child
    const unlisten = history.listen((location) => {
      updateChildHistory(location);
    });

    return () => unlisten();
  }, [history.location]);

  return <div ref={ref} />;
};

export default CheckoutApp;
