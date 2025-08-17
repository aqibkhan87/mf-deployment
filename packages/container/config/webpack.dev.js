const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageDeps = require('../package.json').dependencies;
const commonConfig = require("./webpack.common");

const devConfig = {
  mode: "development",
  devServer: {
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [
    new ModuleFederationPlugin({
       remotes: {
          dashboard: 'dashboard@http://localhost:8081/remoteEntry.js',
          marketing: 'marketing@http://localhost:8082/remoteEntry.js',
       },
       shared: packageDeps
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
