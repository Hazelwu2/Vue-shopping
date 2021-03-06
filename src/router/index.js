import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Login from '@/components/pages/Login';

// Admin 後台
import Dashboard from '@/components/Dashboard';
import Products from '@/components/pages/Products';
import Orders from '@/components/pages/Orders';
import Coupons from '@/components/pages/Coupons';

// Admin 模擬/
import CustomerOrder from '@/components/pages/CustomerOrder';
import CustomerCheckout from '@/components/pages/CustomerCheckout';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '*',
      redirect: 'login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true }
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: Coupons,
          meta: { requiresAuth: true }
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'customer_order',
          name: 'CustomerOrder',
          component: CustomerOrder
        },
        {
          path: 'customer_checkout/:orderId',
          name: 'CustomerCheckout',
          component: CustomerCheckout
        }
      ]
    }
  ]
});
