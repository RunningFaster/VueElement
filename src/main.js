import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import { Message } from 'element-ui'
// vue-cli 自动导入的 element 对象
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入第三方包，表格树形结构
import TreeTable from 'vue-table-with-tree-grid'
// 导入axios包
import axios from 'axios'

// 配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// axios 拦截器，作用是在每次请求时修改 请求信息，包括请求头，等信息
axios.interceptors.request.use(config => {
  // 在请求头添加 Authorization
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//   if (response.data.meta.status !== 200) Message.error(response.data.meta.msg)
//   return response
// }, function (error) {
//   // 对响应错误做点什么
//   return Promise.reject(error)
// })
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
