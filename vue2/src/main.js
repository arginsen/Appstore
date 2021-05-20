import Vue from 'vue';

import {
  Input,
  Row,
  Col,
  Loading,
} from 'element-ui';

import App from './App.vue';
import store from './store';
import router from './router';
import axios from './axios';

import './assets/css/index.css';
import './assets/css/index-mobile.css';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

Vue.use(Input);
Vue.use(Row);
Vue.use(Col);
Vue.use(Loading);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
