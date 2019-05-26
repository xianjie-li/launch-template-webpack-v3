const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base');
const config = require('./config');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const DashboardPlugin = require("webpack-dashboard/plugin");


process.env.NODE_ENV = 'production';

// 构建分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

// 清理 dist
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 移动文件 CopyWebpackPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 压缩js 去除 dead code
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// 抽取 css
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: `${config.staticPath}/css/[name]${
    config.hash ? '.[contenthash]' : ''
  }.css`,
  disable: process.env.NODE_ENV === 'development'
});

let prodOptions = {
  output: {
    filename: `${config.staticPath}/js/[name].chunk${
      config.hash ? '.[chunkhash]' : ''
    }.js`,
    path: path.resolve(__dirname, '../dist'),
    publicPath: config.assetsPublicPath
  },
  devtool: config.sourceMap ? 'source-map' : 'none',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          // 防止打包后css的图片等路径不对
          publicPath: '../../',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: config.cssMini,
                sourceMap: config.sourceMap
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: config.sourceMap
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: config.sourceMap,
                data: config.sassVars
              }
            }
          ]
        })
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        // include: resolve('src'),
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          publicPath: '../../',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: config.cssMini
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new DashboardPlugin,
    new VueLoaderPlugin(),
    // 自动清理 dist 文件夹
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
      verbose: true
    }),
    // hash处理
    new webpack.HashedModuleIdsPlugin(),

    // css 提取 样式表采用contenthash
    // new ExtractTextPlugin('./css/styles.[contenthash].css'),

    // scss
    extractSass,

    new UglifyJSPlugin({
      sourceMap: config.sourceMap,
      uglifyOptions: {
        compress: {
          drop_console: true,
          warnings: false
        }
      }
    }),

    // 开启作用域提升
    new webpack.optimize.ModuleConcatenationPlugin(),

    // 环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      BASE_URL: JSON.stringify('www.xxx.com/api')
    }),
    // 移动静态资源目录
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, `../${config.publicPath}`),
        to: path.resolve(__dirname, `../dist/${config.publicPath}`)
      }
    ]),
    new HtmlBeautifyPlugin({
      config: {
        end_with_newline: true,
        indent_size: 2,
        indent_with_tabs: true,
        indent_inner_html: true,
        preserve_newlines: true
      },
      replace: [' type="text/javascript"']
    })
  ]
};

// 打包视图
if (process.env.npm_config_report) {
  prodOptions.plugins.push(new BundleAnalyzerPlugin());
}

// gzip
if (config.gzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin');

  prodOptions.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|html|css)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

module.exports = merge(base, prodOptions);
