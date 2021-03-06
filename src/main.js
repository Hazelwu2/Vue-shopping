// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
/*
  第三方套件
    - vue-axios
*/
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';

import App from './App'
import router from './router'
import './bus';
import VeeValidate from 'vee-validate';
import currencyFilter from './filters/currency';
import dateFilter from './filters/date';
import zh_TW from 'vee-validate/dist/locale/zh_TW';

import VueI18n from 'vue-i18n';
// 載入表單驗證中文語系
Vue.use(VueI18n);


axios.defaults.withCredentials = true;

Vue.config.productionTip = false
Vue.use(VueAxios, axios);
Vue.component('loading', Loading);
Vue.filter('currency', currencyFilter);
Vue.filter('date', dateFilter);

const i18n = new VueI18n({
    locale: 'zh_TW'
});

Vue.use(VeeValidate, {
    i18n,
    dictionary: {
        zh_TW
    },
    events: 'input|blur'
});

/* eslint-disable no-new */
new Vue({
  i18n,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  const api = `${process.env.APIPATH}/api/user/check`;
  
  if (to.meta.requiresAuth === true) {
    // 假設今天進入的頁面是需要驗證的
    axios.post(api).then(response => {
      console.log(response.data);
      if (response.data.success) { // 如果成功登入的話
        next();
      } else {
        next({
          path: '/login',
        })
      }
    })
  } else {
    next();
  }
});
// Axios只能在元件下使用，this.$http 只能在元件下使用
// 在router下使用，直接呼喚axios即可