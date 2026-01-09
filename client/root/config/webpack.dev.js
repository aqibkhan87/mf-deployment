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
    publicPath: "http://localhost:8080/",
  },
  devServer: {
    port: 8080,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true, // for hot reloading
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        dashboard: `dashboard@http://localhost:8081/remoteEntry.js?v=${Date.now()}`,
        auth: `auth@http://localhost:8082/remoteEntry.js?v=${Date.now()}`,
        checkout: `checkout@http://localhost:8083/remoteEntry.js?v=${Date.now()}`,
        store: `store@http://localhost:8084/remoteEntry.js?v=${Date.now()}`,
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
      },
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
