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
    debugger;

    // Prepend the matching base path before pushing to parent history
    for (const basePath of basePaths) {
      if (childPath.startsWith(basePath)) {
        // Already has basePath
        if (childPath !== history?.location.pathname) {
          history.push(childPath);
        }
        return;
      }
    }
    // If child path did not include base path, prepend based on current location
    const parentBasePath = basePaths.find((base) =>
      history?.location.pathname.startsWith(base)
    );
    const newParentPath = (parentBasePath || "") + childPath;
    if (newParentPath !== history?.location.pathname) {
      history.push(newParentPath);
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

    history.listen(updateChildHistory);
  }, [history.location.pathname]);

  return <div ref={ref} />;
};

export default CheckoutApp;
