import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { loadRemoteMF } from "../loadRemoteMF";

const DashboardApp = () => {
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

    const loadDashboardApp = async () => {
      if (isMountedRef.current) return;
      isMountedRef.current = true;
      const { mount } = await loadRemoteMF(
        `${process.env.DASHBOARD_MF_ENDPOINT}/remoteEntry.js?v=${Date.now()}`,
        "dashboard",
        "./DashboardApp"
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

    loadDashboardApp();

    return () => {
      if (unlisten) unlisten();
      isMountedRef.current = false;
    };
  }, [history.location]);

  return <div ref={ref} />;
};

export default DashboardApp;
