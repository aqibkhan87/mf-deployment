const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageDeps = require('../package.json').dependencies;
const commonConfig = require("./webpack.common");

const devConfig = {
  mode: "development",
  devServer: {
    port: 8081,
    historyApiFallback: {
      index: "index.html",
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'marketing',
      filename: 'remoteEntry.js',
      exposes: {
        "./MarketingApp": './src/bootstrap'
      },
      shared: packageDeps
    })
  ],
};

module.exports = merge(commonConfig, devConfig);
