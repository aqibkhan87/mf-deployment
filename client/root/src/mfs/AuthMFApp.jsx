import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { loadRemoteMF } from "../loadRemoteMF";

const AuthApp = () => {
  const ref = useRef(null);
  const isMountedRef = useRef(false);
  const history = useHistory();

  // 🔹 Child → Parent
  const updateParentHistory = (childLocation) => {
    const { pathname: childPath, search } = childLocation?.location ?? childLocation;
    if (childPath !== history.location.pathname) {
      history.push({ pathname: childPath, search: search || "" }); // ✅ no prefixing here
    }
  };

  useEffect(() => {
    let unlisten;
    
    const loadAuthApp = async () => {
      if (isMountedRef.current) return;
      isMountedRef.current = true;
      const config = window.__MF_CONFIG__;
      const version = config.auth;
      const { mount } = await loadRemoteMF(
        `${process.env.AUTH_MF_ENDPOINT}/${version}/remoteEntry.js?v=${Date.now()}`,
        "auth",
        "./AuthApp"
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

    loadAuthApp();

    return () => {
      if (unlisten) unlisten();
      isMountedRef.current = false;
    };
  }, [history.location]);

  return <div ref={ref} />;
};

export default AuthApp;
