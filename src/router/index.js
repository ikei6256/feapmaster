import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// import Signin from '../views/Signin.vue'
import Battle from '../views/Battle.vue'
import Test from '../views/Test.vue'
import Test2 from '../views/Test2.vue'
import Test3 from '../views/Test3.vue'

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
  { path: '/battle', name: 'Battle', component: Battle }, // 対戦画面
  { path: '/test', name: 'test', component: Test }, // 動作テスト用
  { path: '/test2', name: 'test2', component: Test2 }, // 動作テスト用2
  { path: '/test3', name: 'test3', component: Test3 } // 動作テスト用3
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
