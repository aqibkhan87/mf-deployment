const webpack = require("webpack");
const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageDeps = require("../package.json").dependencies;
const path = require("path");
const dotenv = require("dotenv");
const env = dotenv.config({ path: path.resolve(__dirname, "../.env") }).parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

console.log("envKeys", envKeys);

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "https://checkout.metacook.in/",
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new ModuleFederationPlugin({
      name: "checkout",
      filename: "remoteEntry.js",
      remotes: {
        store: "store@https://store.metacook.in/remoteEntry.js",
      },
      exposes: {
        "./CheckoutApp": "./src/bootstrap",
      },
      shared: packageDeps,
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
