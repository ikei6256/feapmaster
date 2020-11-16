<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Hiragino Sans', 'ヒラギノ角ゴシック', 'Hiragino Kaku Gothic ProN',
    'ヒラギノ角ゴ ProN W3', 'Meiryo', 'メイリオ', 'Droid Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
li {
  list-style-type: none;
}
:focus {
  outline: none;
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
</style>
