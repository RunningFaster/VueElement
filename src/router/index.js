import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 重定向路由信息，将路由指向对应的地址
    { path: '/', redirect: '/home' },
    // 设置路由对应的 组件
    { path: '/login', component: Login },
    {
      // 家目录，并设置默认的跳转的页面
      path: '/home',
      component: Home,
      redirect: '/welcome',
      // 子页面
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params }
      ]
    }
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
