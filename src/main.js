import Vue from 'vue'
import App from './App.vue'
import router from './router'
// vue-cli 自动导入的 element 对象
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

// 导入axios包
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// axios 拦截器，作用是在每次请求时修改 请求信息，包括请求头，等信息
axios.interceptors.request.use(config => {
  console.log(config)
  // 在请求头添加 Authorization
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
