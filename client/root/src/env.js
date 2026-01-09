export const ENV =
  window.__ENV__ ||
  (location.hostname.includes("localhost") && "dev") ||
  "prod";

export const MANIFEST_URLS = {
  prod: "https://www.metacook.in/config/manifest-prod.json"
};
