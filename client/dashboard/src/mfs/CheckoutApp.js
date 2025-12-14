import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { loadRemoteMF } from "./../loadRemoteMF";

const CheckoutApp = () => {
  const ref = useRef(null);
  const isMountedRef = useRef(false);
  const history = useHistory();

  // 🔹 Child → Parent
  const updateParentHistory = (childLocation) => {
    const { pathname: childPath } = childLocation?.location ?? childLocation;
    if (childPath !== history.location.pathname) {
      history.push(childPath); // ✅ no prefixing here
    }
  };

  useEffect(() => {
    let unlisten;

    const loadCheckoutApp = async () => {
      if (isMountedRef.current) return;
      isMountedRef.current = true;
      const { mount } = await loadRemoteMF(
        `${process.env.CHECKOUT_MF_ENDPOINT}/remoteEntry.js`,
        "checkout",
        "./CheckoutApp"
      );
      const { updateChildHistory } = mount(ref.current, {
        updateParentHistory,
        initialPath: history.location.pathname, // ✅ full path
      });

      // 🔹 Parent → Child
      unlisten = history.listen((location) => {
        updateChildHistory(location);
      });
    };

    loadCheckoutApp();

    return () => {
      if (unlisten) unlisten();
      isMountedRef.current = false;
    };
  }, [history.location]);

  return <div ref={ref} />;
};

export default CheckoutApp;
