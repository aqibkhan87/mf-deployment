const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin")
const commonConfig = require("./webpack.common");
const packageDeps = require('../package.json').dependencies;

const domain = "https://www.metacook.in";
console.info("domain", domain)

const prodConfig = {
  mode: "production",
  output: {
    filename: '[name].[contenthash].js',
    publicPath: "https://www.metacook.in/",
  },
  plugins: [
    new ModuleFederationPlugin({
      remotes: {
        dashboard: `dashboard@https://dashboard.metacook.in/remoteEntry.js`,
        marketing: `marketing@https://marketing.metacook.in/remoteEntry.js`
      },
      shared: packageDeps
    })
  ],
};

module.exports = merge(commonConfig, prodConfig);
