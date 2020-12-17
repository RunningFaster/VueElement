import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 重定向路由信息，将路由指向对应的地址
    { path: '/', redirect: '/login' },
    // 设置路由对应的 组件
    { path: '/login', component: Login }
  ]
})

export default router
