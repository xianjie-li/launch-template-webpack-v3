/**
 * -------------------------
 * Author：lxj
 * gitHub: https://github.com/Iixianjie/webpack-templates/tree/webpack-v3
 * -------------------------
 */

const fs = require('fs');
/* 是否一次载入所有html */
const includeAll = true;
/* 需要载入的html */
const includeFiles = ['disciss_around'];

module.exports = {
  htmls: getFileNameList('./src/html'),
  HOST: '0.0.0.0',
  PORT: '10086',
  proxy: {
    // "/api": {
    //   target: "http://localhost:3000",
    //   pathRewrite: {
    //     "^/api": ""
    //   }
    // }
  },
  sourceMap: false,
  cssMini: true,
  gzip: true,
  hash: false,
  assetsPublicPath: './', // html和js等文件中访问静态资源的路径，可以是一个http地址，相对路径(/)或绝对路径(./)
  staticPath: 'resource', // 文件输出目录的目录名
  publicPath: 'resource', // 静态资源路径，不通过webpack打包，项目中通过/访问，对应根目录下的resource，需要同步更改

  // 所以这里假设你有 `src//scss/_base/index.scss` 这个文件
  sassVars: '@import "~@/scss/_base/index.scss";',
  htmlHash: false // 在输出html时强制给所有静态资源打上hash
};

function getFileNameList(path) {
  let fileList = [];
  let dirList = fs.readdirSync(path);
  dirList.forEach(item => {
    let tempArr = item.split('.');
    let condition =
      tempArr[1] === 'pug' &&
      (includeAll ? includeAll : includeFiles.includes(tempArr[0]));
    if (condition) {
      fileList.push(tempArr[0]);
    }
  });
  return fileList;
}
