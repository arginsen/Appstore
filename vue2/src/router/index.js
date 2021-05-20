import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Frame from '../views/Frame.vue';
import Detail from '../views/Detail.vue';
import Search from '../views/Search.vue';
import Error from '../views/Error.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '',
    name: 'Frame',
    component: Frame,
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      },
      {
        path: '/detail',
        name: 'Detail',
        component: Detail,
      },
      {
        path: '/search',
        name: 'Search',
        component: Search,
      },
    ],
  },
  {
    path: '/error',
    name: 'Error',
    component: Error,
  },
  {
    path: '/*',
    name: 'NotFound',
    beforeEnter: (to, from, next) => next('/'),
  },
];

const router = new VueRouter({
  mode: 'hash',
  routes,
});

export default router;
