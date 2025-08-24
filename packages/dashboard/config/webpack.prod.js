const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin")
const commonConfig = require("./webpack.common");
const packageDeps = require('../package.json').dependencies;

const domain = "https://www.metacook.in";

const prodConfig = {
  mode: "production",
  output: {
    filename: '[name].[contenthash].js',
    publicPath: "https://www.metacook.in/",
  },
  plugins: [
    new ModuleFederationPlugin({
      remotes: {
        auth: `auth@https://auth.metacook.in/remoteEntry.js`,
        checkout: `checkout@https://checkout.metacook.in/remoteEntry.js`,
        store: 'store@https://store.metacook.in/remoteEntry.js',
      },
      shared: packageDeps
    })
  ],
};

module.exports = merge(commonConfig, prodConfig);
