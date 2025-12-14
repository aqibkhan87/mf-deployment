import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { loadRemoteMF } from "../loadRemoteMF";

const AuthApp = () => {
  const ref = useRef(null);
  const isMountedRef = useRef(false);
  const history = useHistory();

  // 🔹 Child → Parent
  const updateParentHistory = (childLocation) => {
    const { pathname: childPath } = childLocation?.location ?? childLocation;
    if (childPath !== history.location.pathname) {
      history.push(childPath);
    }
  };

  useEffect(() => {
    let unlisten;
    
    const loadAuthApp = async () => {
      if (isMountedRef.current) return;
      isMountedRef.current = true;
      const { mount } = await loadRemoteMF(
        `${process.env.AUTH_MF_ENDPOINT}/remoteEntry.js?${Date.now()}`,
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
