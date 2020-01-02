import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import VueLazyLoad from 'vue-lazyload'
import vueToTop from 'vue-totop'
import Axios from 'axios'
// import Interceptor from './login/interceptor'
// import Login from './login/login'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import ElasticSearch from 'api/elasticsearch'

fastclick.attach(document.body)
/* eslint-disable no-new */
Vue.use(VueLazyLoad, {
  loading: require('common/images/lazyLoad.gif')
})
Vue.use(Element)
// Vue.use(ElasticSearch)
Vue.use(router)
// Vue.prototype.login = Login
// Vue.prototype.interceptor = Interceptor
Vue.prototype.axios = Axios
Vue.use(vueToTop, {
  type: 5,
  top: 5000,
  right: 8,
  bottom: 30,
  size: 20
})
new Vue({
  el: '#app',
  router,
  store,
  Axios,
  render: h => h(App)
})

// router.beforeEach((to, from, next) => {
//   // 获取用户登陆之后的一个储存登陆状态
//   const getFlag = localStorage.getItem('Flag')
//   if (getFlag === 'isLogin') {
//   // 如果用户的登陆状态时true，那么，设置vuex登陆的状态为true
//     // 如果，已登陆了，那么，用户跳转到user页面
//     next()
//     if (!to.meta.isLogin) {
//       next()
//     }
//   } else {
//     if (to.meta.isLogin) {
//       next({
//         path: '/login'
//       })
//       console.log('请先登陆！')
//     } else {
//       next()
//     }
//   }
// })
