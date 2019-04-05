import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/pages/Login'

// Admin 後台
import Dashboard from '@/components/Dashboard'
import Products from '@/components/pages/Products'
import Orders from '@/components/pages/Orders'
import Coupons from '@/components/pages/Coupons'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: 'login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/admin',
      name: 'HelloWorld',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true},
        },
        {
            path: 'orders', // 模擬訂單
            name: 'Orders',
            component: Orders,
            meta: {requiresAuth: true}
        },
        {
            path: 'coupons', // 模擬訂單
            name: 'Coupons',
            component: Coupons,
            meta: {requiresAuth: true}
        },
      ]
    },
  ]
})
