const webpack = require("webpack");
const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const path = require("path");
const dotenv = require("dotenv");
const env = dotenv.config({ path: path.resolve(__dirname, "../.env") }).parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

console.log("envKeys", envKeys);

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
    hot: true, // enables hot reloading
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,HEAD,PUT,POST,DELETE",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new ModuleFederationPlugin({
      name: "auth",
      filename: "remoteEntry.js",
      remotes: {
        store: `store@http://localhost:8083/remoteEntry.js?v=${Date.now()}`,
      },
      exposes: {
        "./AuthApp": "./src/bootstrap",
      },
      shared: {
        react: { singleton: true, eager: false, requiredVersion: false },
        "react-dom": { singleton: true, eager: false, requiredVersion: false },
      },
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
