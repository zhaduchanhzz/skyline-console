// Copyright 2021 99cloud
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { resolve } = require('path');
const autoprefixer = require('autoprefixer');

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const common = require('./webpack.common');

const {
  getServerConfig,
  getThemeConfig,
  getCustomStyleVariables,
} = require('./utils');

const theme = getThemeConfig();

console.log('theme', theme);

const root = (path) => resolve(__dirname, `../${path}`);

const { host, port } = getServerConfig();

module.exports = (env) => {
  const API = (env || {}).API || 'mock';

  console.log('API %s', API);

  // const devServer = {
  //   host,
  //   port,
  //   contentBase: root('dist'),
  //   historyApiFallback: true,
  //   compress: true,
  //   hot: true,
  //   inline: true,
  //   disableHostCheck: true,
  //   progress: true,
  //   // WARNING: disable the following attribute when debug webpack.
  //   stats: {
  //     children: false,
  //     chunks: false,
  //     chunkModules: false,
  //     modules: false,
  //     reasons: false,
  //     useExports: false,
  //   },
  // };

  const devServer = {
    host,
    port,
    static: {
      directory: root('dist'),
    },
    historyApiFallback: true,
    compress: true,
    hot: true,
    client: {
      overlay: { errors: true, warnings: false, runtimeErrors: false },
    },
    devMiddleware: {
      stats: {
        children: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        reasons: false,
        usedExports: false,
      },
    },
  };

  if (API === 'local') {
    // This mode serves a small, same-origin API for local UI development.
    // Bind only to localhost because it uses the documented demo credentials.
    devServer.host = '127.0.0.1';
    devServer.port = Number(process.env.SKYLINE_LOCAL_PORT || 8089);
    devServer.setupMiddlewares = (middlewares) => {
      const { createStandaloneMock } = require('./standalone-mock');
      middlewares.unshift({
        name: 'standalone-mock',
        middleware: createStandaloneMock(),
      });
      return middlewares;
    };
  } else if (API === 'mock' || API === 'dev') {
    devServer.proxy = require('./server.dev').proxy;
  }

  const { version, ...restConfig } = common;

  return merge(restConfig, {
    entry: {
      main: root('src/core/index.jsx'),
    },
    output: {
      filename: '[name].js',
      path: root('dist'),
      publicPath: '/',
    },
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer,
    module: {
      rules: [
        // `react-refresh` only works in develop mode
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            'thread-loader',
            {
              loader: 'babel-loader',
              options: {
                plugins: ['react-refresh/babel'],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            'thread-loader',
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.(css|less)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'style-loader', // creates style nodes from JS strings
            },
            {
              loader: 'css-loader', // translates CSS into CommonJS
              options: {
                modules: {
                  mode: 'global',
                },
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [autoprefixer('last 2 version')],
                sourceMap: true,
              },
            },
            {
              loader: 'less-loader', // compiles Less to CSS
              options: {
                importLoaders: true,
                javascriptEnabled: true,
              },
            },
            {
              loader: resolve('config/less-replace-loader'),
              options: {
                variableFile: getCustomStyleVariables(),
              },
            },
          ],
        },
        {
          test: /\.(less)$/,
          include: /node_modules/,
          use: [
            {
              loader: 'style-loader', // creates style nodes from JS strings
            },
            'thread-loader',
            {
              loader: 'css-loader', // translates CSS into CommonJS
            },
            {
              loader: 'less-loader', // compiles Less to CSS
              options: {
                javascriptEnabled: true,
                modifyVars: theme,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      // new webpack.HotModuleReplacementPlugin(), `hmr` is outdated, now using `react-refresh`
      new ReactRefreshWebpackPlugin({ overlay: false }),
      // new OpenBrowserPlugin({
      //   url: 'http://localhost:8080',
      //   browser: "Google Chrome",
      // }),
      new webpack.DefinePlugin({
        // Inject environment variables for the project
        'process.env.API': JSON.stringify(API),
      }),
      new HtmlWebPackPlugin({
        template: root('src/asset/template/index.html'),
        favicon: root('src/asset/image/favicon.ico'),
      }),
    ],
  });
};
