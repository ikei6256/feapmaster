import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false; // 開発中は true にしたほうがいいかも
// true の場合の方が開発者向けのメッセージがコンソールによりたくさん出るようです。

/* eslint-disable no-new */

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
