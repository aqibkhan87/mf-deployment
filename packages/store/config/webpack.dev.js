const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const packageDeps = require("../package.json").dependencies;
const commonConfig = require("./webpack.common");
const path = require("path");

const devConfig = {
  mode: "development",
  output: {
    publicPath: "http://localhost:8083/",
  },
  devServer: {
    port: 8083,
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, "dist"), // v4 syntax
    },
    hot: true, // ✅ enables hot reloading
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "store",
      filename: "remoteEntry.js",
      exposes: {
        "./authStore": "./src/store/authStore.js",
        "./productContext": "./src/context/productContext.js",
      },
      shared: packageDeps,
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
