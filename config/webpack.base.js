const path = require('path');
const webpack = require('webpack');
const config = require('./config');
// html模板处理
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 待生成的HTML页面
let HTMLs = [];
// 入口文件列表
let Entries = {};

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

// 处理入口文件和生成页的数据
config.htmls.forEach(page => {
  const htmlPlugin = new HtmlWebpackPlugin({
    title: page,
    filename: `${page}.html`,
    template: path.resolve(__dirname, `../src/html/${page}.pug`),
    chunks: ['manifest', 'vendor', page],
    hash: config.htmlHash
  });
  HTMLs.push(htmlPlugin);
  Entries[page] = path.resolve(__dirname, `../src/js/${page}.js`);
});

module.exports = {
  entry: Entries,
  resolve: {
    // 快速入口
    extensions: ['.js', '.jsx', '.vue'],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        exclude: path.resolve(__dirname, '../', 'src/vue'),
        use: [
          {
            loader: 'pug-loader',
            options: {
              filters: {
                testFilter(text, options) {
                  return text + JSON.stringify(options);
                }
              }
            }
          }
        ]
      },
      /* vue需要pug直接返回字符，而不是一个方法 */
      {
        test: /\.pug$/,
        include: path.resolve(__dirname, '../', 'src/vue'),
        use: [
          {
            loader: 'pug-plain-loader'
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:7].[ext]',
            outputPath: `${config.staticPath}/images/`
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:7].[ext]',
            outputPath: `${config.staticPath}/video/`
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: `${config.staticPath}/fonts/`
          }
        }
      }
    ]
  },
  plugins: [
    // 路径标识
    new webpack.NamedModulesPlugin(),
    // 全局变量
    new webpack.ProvidePlugin({
      // Vue: 'vue'
    }),
    // 提取公共模块
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: 2
    }),
    // 单独提取webpack样板,webpack启动文件
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // 通过HtmlWebpackPlugin生成html
    ...HTMLs
  ]
};
