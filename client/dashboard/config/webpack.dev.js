const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const packageDeps = require("../package.json").dependencies;
const commonConfig = require("./webpack.common");
const path = require("path");

const devConfig = {
  mode: "development",
  output: {
    publicPath: "http://localhost:8080/",
  },
  devServer: {
    port: 8080,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "dist"), // ✅ replaces contentBase
    },
    hot: true, // ✅ Ensure this is enabled
  },
  plugins: [
    new ModuleFederationPlugin({
      remotes: {
        auth: "auth@http://localhost:8081/remoteEntry.js",
        checkout: "checkout@http://localhost:8082/remoteEntry.js",
        store: "store@http://localhost:8083/remoteEntry.js",
      },
      shared: packageDeps,
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
