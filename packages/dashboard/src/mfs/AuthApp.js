import React, { useRef, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { mount } from "auth/AuthApp";

const AuthApp = () => {
  const ref = useRef(null);
  const location = useLocation();
  const history = useHistory();

  console.log("location", location)
  console.log("history", history)

  // strip /auth prefix for child
  const subPath = location.pathname.replace(/^\/auth/, "") || "/";

  const handleChildNavigate = (historyLocation) => {
    const { location: newLocation } = historyLocation
    if (newLocation?.pathname !== location.pathname) {
      history.push(newLocation?.pathname);
    }
  };

  useEffect(() => {
    const { onParentNavigate } = mount(ref.current, {
      initialPath: subPath,
      onNavigate: handleChildNavigate
    });
    // Sync child when parent navigates
    const unlisten = history.listen(onParentNavigate);
    return () => unlisten();
  }, []);

  return <div ref={ref} />;
};

export default AuthApp;
