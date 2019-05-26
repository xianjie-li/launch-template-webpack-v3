// dev-server不会监听html变动，需要手动将当前页面加入依赖树
if (process.env.NODE_ENV !== 'production') {
  function pageName() {
    var a = location.href
    if (!(/\.html/.test(a))) {
      return 'index'
    }
    var b = a.split('/')
    var c = b.slice(b.length - 1, b.length).toString(String).split('.')
    return c.slice(0, 1)
  }
  require(`../../html/${pageName()}.pug`)

  // if(module.hot){
  //   module.hot.accept();
  // }
}