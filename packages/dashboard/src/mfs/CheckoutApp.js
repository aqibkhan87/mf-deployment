import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { mount } from "checkout/CheckoutApp";

const CheckoutApp = () => {
  const ref = useRef(null);
  const history = useHistory();
  const isSyncing = useRef(false);

  const handleChildNavigate = (childLocation) => {
    const { pathname: childPath } = childLocation?.location ?? childLocation;
    console.log(
      "in dashboard MF childLocation",
      childPath,
      "historyhistory",
      history,
      "window.location",
      window.location
    );

    if (childPath !== window?.location.pathname) {
      isSyncing.current = true;
      history.push(childPath);
      isSyncing.current = false;
    }
  };

  useEffect(() => {
    const { updateChildHistory } = mount(ref.current, {
      updateParentHistory: handleChildNavigate,
      defaultHistory: history,
    });

    const unlisten = history.listen((location) => {
      console.log("location in unlisten from parent Checkout", location);
      if (!isSyncing.current) {
        isSyncing.current = true;
        updateChildHistory(location);
        isSyncing.current = false;
      }
    });

    return () => unlisten();
  }, [history.location.pathname, history]);

  return <div ref={ref} />;
};

export default CheckoutApp;
