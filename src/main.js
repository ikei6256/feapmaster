import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrapのスタイルシート側の機能を読み込む
import "bootstrap/dist/js/bootstrap" // BootstrapのJavaScript側の機能を読み込む

Vue.config.productionTip = true // 開発中は true にしたほうがいいかも
// true の場合の方が開発者向けのメッセージがコンソールによりたくさん出るようです。

/* eslint-disable no-new */

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
