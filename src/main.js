import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrapのスタイルシート側の機能を読み込む
import "bootstrap"; // BootstrapのJavaScript側の機能を読み込む

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
