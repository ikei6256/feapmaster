<template>
  <div id="app">
    <header-component></header-component>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  components: {
    "header-component": Header,
  },
  mounted() {
    // console.log("--- App: mounted ---");
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, 'Hiragino Sans', 'ヒラギノ角ゴシック', 'Hiragino Kaku Gothic ProN',
    'ヒラギノ角ゴ ProN W3', 'Meiryo', 'メイリオ', 'Droid Sans',sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

/*
 * 画面遷移のアニメーション
 */
.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.35s ease-in-out;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}

/*
 * 少し遅くしたフェードアウト/フェードイン
 */
.fade-slow {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.75s ease-in-out;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}

/*
 * opacity
 */
.opacity-0 {
  opacity: 0;
}
</style>
