const webpack = require("webpack");
const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageDeps = require("../package.json").dependencies;
const path = require("path");
const dotenv = require("dotenv");

const envFile = path.resolve(__dirname, "../.env.production");
const fileEnv = dotenv.config({ path: envFile }).parsed || {};

const finalEnv = {
  ...fileEnv,
  ...process.env, // GitHub Actions injects here
};

const ALLOWED_KEYS = [
  "API_BASE_URL",
  "RAZORPAY_KEY_ID",
  "AUTH_MF_ENDPOINT",
  "DASHBOARD_MF_ENDPOINT",
  "CHECKOUT_MF_ENDPOINT",
  "STORE_MF_ENDPOINT",
];

const envKeys = ALLOWED_KEYS.reduce((acc, key) => {
  if (finalEnv[key]) {
    acc[`process.env.${key}`] = JSON.stringify(finalEnv[key]);
  }
  return acc;
}, {});

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "https://www.metacook.in/",
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new ModuleFederationPlugin({
      remotes: {
        store: `store@https://store.metacook.in/remoteEntry.js?v=${Date.now()}`,
      },
      shared: {
        react: {
          singleton: true,
          eager: false,
          requiredVersion: false,
        },
        "react-dom": {
          singleton: true,
          eager: false,
          requiredVersion: false,
        },
        "@mui/material": { singleton: true },
        "@mui/system": { singleton: true },
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
