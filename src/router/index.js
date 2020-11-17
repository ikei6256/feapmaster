import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store/index";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // {
  //   path: '/about', name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  { path: '/login', name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue') }, // ログイン画面
  { path: '/battle', name: 'Battle',
    component: () => import(/* webpackChunkName: "battle" */ '../views/Battle.vue') }, // 対戦画面
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  console.log(store.state.auth);
  console.log(to);
  console.log(from);
  next();
})

export default router
