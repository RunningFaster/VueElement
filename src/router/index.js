import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 重定向路由信息，将路由指向对应的地址
    { path: '/', redirect: '/login' },
    // 设置路由对应的 组件
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})

// 挂载路由导航守卫，在页面请求时，率先进行的处理函数
// 常用来控制权限
router.beforeEach((to, from, next) => {
  // to 表示将要访问的路径
  // from 表示从哪个路径而来
  // next 是一个函数， next()放行  next('/login')指定页面
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
