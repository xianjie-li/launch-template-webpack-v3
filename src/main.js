/* 修复webpack不监听html的bug */
import './common/util/fix';

/* 引入公共样式 */
import './scss/main.scss';


/* VUE */
// let isProd = process.env.NODE_ENV === 'production' ? false : true
// Vue.config.debug = isProd
// Vue.config.devtools = isProd
// Vue.config.productionTip = isProd

console.log(BASE_URL);
