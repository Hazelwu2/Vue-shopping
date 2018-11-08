import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/pages/Login'

// Admin 後台
import Dashboard from '@/components/Dashboard'
import Products from '@/components/pages/Products'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: 'login',
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: { requiresAuth: true}
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
        }
      ]
    },
  ]
})
