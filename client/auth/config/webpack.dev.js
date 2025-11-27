const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageDeps = require('../package.json').dependencies;
const commonConfig = require("./webpack.common");
const path = require("path");

const devConfig = {
  mode: "development",
  output: {
    publicPath: "http://localhost:8081/",
  },
  devServer: {
    port: 8081,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true, // ✅ enables hot reloading
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'auth',
      filename: 'remoteEntry.js',
      remotes: {
          store: 'store@http://localhost:8083/remoteEntry.js',
      },
      exposes: {
        "./AuthApp": './src/bootstrap',
        "./loginSummary": './src/common/loginSummary',
        "./addressForm": './src/common/addressForm',
      },
      shared: packageDeps
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
