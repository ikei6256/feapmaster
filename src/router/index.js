import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store/index";

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  // {
  //   path: "/about", name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
  // },
  {
    path: "/login", // ログイン画面
    name: "Login",
    component: () => import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/mypage", // マイページ
    name: "Mypage",
    component: () => import(/* webpackChunkName: "mypage" */ "../views/Mypage.vue")
  },
  {
    path: "/battle", // 対戦画面
    name: "Battle",
    component: () => import(/* webpackChunkName: "battle" */ "../views/Battle.vue")
  },
  {
    path: "/test", // テスト用
    name: "Test",
    component: () => import(/* webpackChunkName: "test" */ "../views/Test.vue")
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

// 遷移前に実行
router.beforeEach((to, from, next) => {
  // ログインページかマイページの時にログインチェック
  if (to.name === "Login" || to.name === "Mypage") {
    const unsubscribe = store.state.auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        // logged in
        // ログインしている状態でログインページへアクセスした場合はホームへ移動
        if (to.name === "Login") next({ name: "Home" });
        else next();
      } else {
        // logged out
        // ログインしていない状態でマイページへアクセスした場合はログインへ移動
        if (to.name === "Mypage") next({ name: "Home" });
        else next();
      }
    })
  } else {
    next()
  }
})

export default router
