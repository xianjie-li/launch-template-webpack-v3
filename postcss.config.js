module.exports = {
  plugins: {
    'autoprefixer': {
      browsers: ['last 7 version', 'Android >= 4.1', 'not ie <= 8'],
      // browsers: ['iOS >= 7', 'Android >= 4.1'],  // 移动端
      // 是否美化属性值 默认：true
      cascade: true,
      // 是否去掉不必要的前缀 默认：true
      remove: true
    },
    'cssnano': {
      zindex: false,
      reduceIdents: false
    },
  }
};