const webpack = require("webpack");
const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageDeps = require("../package.json").dependencies;
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "https://auth.metacook.in/",
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: { drop_console: true },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "auth",
      filename: "remoteEntry.js",
      remotes: {
        store: 'store@https://store.metacook.in/remoteEntry.js',
      },
      exposes: {
        "./AuthApp": "./src/bootstrap",
        "./loginSummary": './src/common/loginSummary',
        "./addressForm": './src/common/addressForm',
      },
      shared: packageDeps,
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
