const webpack = require("webpack");
const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageDeps = require("../package.json").dependencies;
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const dotenv = require("dotenv");

// Load .env.production ONLY if it exists (local dev)
const envFile = path.resolve(__dirname, "../.env.production");
const fileEnv = dotenv.config({ path: envFile }).parsed || {};

// Merge process.env (CI) + file-based env
const finalEnv = {
  ...fileEnv,
  ...process.env, // ✅ GitHub Actions injects here
};

// Pick ONLY allowed frontend vars
const ALLOWED_KEYS = [
  "API_BASE_URL",
  "RAZORPAY_KEY_ID",
];

const envKeys = ALLOWED_KEYS.reduce((acc, key) => {
  if (finalEnv[key]) {
    acc[`process.env.${key}`] = JSON.stringify(finalEnv[key]);
  }
  return acc;
}, {});

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "https://auth.metacook.in/",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
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
    new webpack.DefinePlugin(envKeys),
    new ModuleFederationPlugin({
      name: "auth",
      filename: "remoteEntry.js",
      remotes: {
        store: "store@https://store.metacook.in/remoteEntry.js",
      },
      exposes: {
        "./AuthApp": "./src/bootstrap",
        "./loginSummary": "./src/common/loginSummary",
        "./addressForm": "./src/common/addressForm",
      },
      shared: packageDeps,
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
