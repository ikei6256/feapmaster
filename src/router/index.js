import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// import Signin from '../views/Signin.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  // { path: '/signin', name: 'Signin', component: Signin }, // サインイン画面
  { path: '/battle', name: 'Battle',
    component: () => import(/* webpackChunkName: "battle" */ '../views/Battle.vue') }, // 対戦画面
  { path: '/test', name: 'Test',
    component: () => import(/* webpackChunkName: "test" */ '../views/Test.vue') }, // 動作テスト用
  { path: '/test2', name: 'Test2',
    component: () => import(/* webpackChunkName: "test2" */ '../views/Test2.vue') }, // 動作テスト用2
  { path: '/test3', name: 'Test3',
    component: () => import(/* webpackChunkName: "test3" */ '../views/Test3.vue') } // 動作テスト用3
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
