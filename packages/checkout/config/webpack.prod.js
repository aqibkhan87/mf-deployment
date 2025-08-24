const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageDeps = require("../package.json").dependencies;

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "https://checkout.metacook.in/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "checkout",
      filename: "remoteEntry.js",
      exposes: {
        "./CheckoutApp": "./src/bootstrap",
      },
      shared: packageDeps,
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
