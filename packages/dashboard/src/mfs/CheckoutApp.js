import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { mount } from "checkout/CheckoutApp";

const CheckoutApp = () => {
  const ref = useRef(null);
  const history = useHistory();

  const updateParentHistory = (childLocation) => {
    const { pathname: childPath } = childLocation?.location ?? childLocation;
    console.log(
      "In CHECKOUT updateParentHistory",
      childLocation,
      "HISTORY",
      history
    );
    if (childPath !== history?.location.pathname) {
      history.push(childPath);
    }
  };

  useEffect(() => {
    const { updateChildHistory } = mount(ref.current, {
      updateParentHistory: updateParentHistory,
      initialPath: history.location.pathname,
    });

    history.listen(updateChildHistory);
  }, [history.location.pathname]);

  return <div ref={ref} />;
};

export default CheckoutApp;
