const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base');
const config = require('./config');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

process.env.NODE_ENV = 'development';

let devOptions = {
  output: {
    filename: 'js/[name].chunk.js'
  },
  devtool: 'eval-source-map',
  devServer: {
    // contentBase: path.resolve(__dirname, '../src'),
    clientLogLevel: 'error', // 提示等级
    quiet: true,
    historyApiFallback: true, // 404定向到index
    // compress: true, // 全部启用gzip
    hot: true,
    host: config.HOST || process.env.HOST,
    port: config.PORT || process.env.PORT,
    inline: true,
    publicPath: '/',
    overlay: {
      // 错误全屏警告
      warnings: false,
      errors: true
    },
    proxy: config.proxy,
    watchOptions: {
      // 使用文件系统监测文件改动
      poll: true
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        // include: resolve('src'),
        use: {
          loader: 'babel-loader?cacheDirectory=true'
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              data: config.sassVars
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          `You application is running here http://localhost:${config.PORT}`
        ]
      }
    }),
    // hot
    new webpack.HotModuleReplacementPlugin(),
    // 环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      BASE_URL: JSON.stringify('/api')
    })
  ]
};

module.exports = merge(base, devOptions);
