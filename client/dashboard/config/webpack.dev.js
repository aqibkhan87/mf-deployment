const webpack = require("webpack");
const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const path = require("path");
const dotenv = require("dotenv");
const env = dotenv.config({ path: path.resolve(__dirname, "../.env") }).parsed;
const packageJson = require("../package.json");
const version = packageJson.version; 

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

console.log("envKeys", envKeys);

const devConfig = {
  mode: "development",
  output: {
    publicPath: `http://localhost:8081/${version}/`,
  },
  devServer: {
    port: 8081,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true, // for hot reloading
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new ModuleFederationPlugin({
      name: "dashboard",
      filename: "remoteEntry.js",
      remotes: {
        store: `store@http://localhost:8084/remoteEntry.js?v=${Date.now()}`,
      },
      exposes: {
        "./DashboardApp": "./src/bootstrap",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: false,
        },
        "@mui/material": { singleton: true },
        "@mui/system": { singleton: true },
      },
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
