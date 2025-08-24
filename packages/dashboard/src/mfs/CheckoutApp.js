import React, { useRef, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { mount } from "checkout/CheckoutApp";

const CheckoutApp = () => {
  const ref = useRef(null);
  const location = useLocation();
  const history = useHistory();

  // strip /auth prefix for child
  const subPath = location.pathname.replace(/^\/checkout|products/, "") || "/";

  const handleChildNavigate = (historyLocation) => {
    const { location: newLocation } = historyLocation
    if (newLocation?.pathname !== location.pathname) {
      history.push(newLocation?.pathname);
    }
  };

  useEffect(() => {
    const { onParentNavigate } = mount(ref.current, {
      initialPath: subPath,
      onNavigate: handleChildNavigate,
    });
    // Sync child when parent navigates
    const unlisten = history.listen(onParentNavigate);
    return () => unlisten();
  }, []);

  return <div ref={ref} />;
};

export default CheckoutApp;
