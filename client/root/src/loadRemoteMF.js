export const loadRemoteMF = async (remoteUrl, scope, module) => {
  // 1️⃣ If remote container already exists, skip adding the script
  if (!window[scope]) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = remoteUrl;
      script.type = "text/javascript";
      script.async = true;

      script.onload = () => {
        // Make sure the container exists after script load
        if (!window[scope] || !window[scope].init) {
          reject(new Error(`MF container ${scope} is invalid`));
        } else {
          resolve();
        }
      };

      script.onerror = () => reject(new Error(`Failed to load ${remoteUrl}`));

      document.head.appendChild(script);
    });
  }

  // 2️⃣ Initialize the container sharing scope
  if (!window[scope].__initialized) {
    await __webpack_init_sharing__("default");
    await window[scope].init(__webpack_share_scopes__.default);
    window[scope].__initialized = true; // mark as initialized
  }

  // 3️⃣ Get the module factory and return it
  const factory = await window[scope].get(module);
  return factory();
};
