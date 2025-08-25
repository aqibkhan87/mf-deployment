const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const packageDeps = require("../package.json").dependencies;
const commonConfig = require("./webpack.common");

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "https://store.metacook.in/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "store",
      filename: "remoteEntry.js",
      exposes: {
        "./authStore": "./src/store/authStore",
        "./productContext": "./src/context/productContext.js",
      },
      shared: packageDeps,
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
