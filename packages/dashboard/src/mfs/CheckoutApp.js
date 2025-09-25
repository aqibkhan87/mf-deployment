import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { mount } from "checkout/CheckoutApp";

const CheckoutApp = () => {
  const ref = useRef(null);
  const history = useHistory();
  
  const handleChildNavigate = (childLocation) => {
    const { pathname: childPath } = childLocation?.location ?? childLocation;
    console.log("in dashboard MF childLocation", childPath, "historyhistory", history)
   
    if (childPath !== history?.location.pathname) {
      history.push(childPath);
    }
  };

  useEffect(() => {
    const { updateChildHistory } = mount(ref.current, {
      updateParentHistory: handleChildNavigate,
      defaultHistory: history
    });

    const unlisten = history.listen(updateChildHistory);

    return () => unlisten();
  }, [history.location.pathname, history]);

  return <div ref={ref} />;
};

export default CheckoutApp;
