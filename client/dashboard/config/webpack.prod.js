const webpack = require("webpack");
const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageDeps = require("../package.json").dependencies;
const path = require("path");
const dotenv = require("dotenv");
// Load .env.production (or .env.prod)
const env = dotenv.config({
  path: path.resolve(__dirname, "../.env.production"),
}).parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

console.log("envKeys", envKeys);

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
        auth: `auth@https://auth.metacook.in/remoteEntry.js`,
        checkout: `checkout@https://checkout.metacook.in/remoteEntry.js`,
        store: "store@https://store.metacook.in/remoteEntry.js",
      },
      shared: packageDeps,
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
