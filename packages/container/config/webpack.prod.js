const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin")
const commonConfig = require("./webpack.common");
const packageDeps = require('../package.json').dependencies;

const domain = process.env.PRODUCTION_DOMAIN;

const prodConfig = {
  mode: "production",
  output: {
    filename: '[name].[contenthash].js'
  },
  plugins: [
    new ModuleFederationPlugin({
      remotes: {
        marketing: `marketing@${domain}/marketing/remoteEntry.js`
      },
      shared: packageDeps
    })
  ],
};

module.exports = merge(commonConfig, prodConfig);
