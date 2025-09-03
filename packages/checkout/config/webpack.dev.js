const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageDeps = require('../package.json').dependencies;
const commonConfig = require("./webpack.common");
const path = require("path");

const devConfig = {
  mode: "development",
  output: {
    publicPath: "http://localhost:8082/",
  },
  devServer: {
    port: 8082,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "dist"), // v4 syntax
    },
    hot: true, // ✅ enables hot reloading
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'checkout',
      filename: 'remoteEntry.js',
      remotes: {
          store: 'store@http://localhost:8083/remoteEntry.js',
          auth: 'auth@http://localhost:8081/remoteEntry.js',
       },
      exposes: {
        "./CheckoutApp": './src/bootstrap'
      },
      shared: packageDeps
    })
  ],
};

module.exports = merge(commonConfig, devConfig);
