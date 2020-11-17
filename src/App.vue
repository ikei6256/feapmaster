<template>
  <v-app>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </v-app>
</template>

<script>
export default {};
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Hiragino Sans", "ヒラギノ角ゴシック", "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", "Meiryo", "メイリオ", "Droid Sans",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: rgba(249, 182, 15, 0.75);
}
li {
  list-style-type: none;
}
:focus {
  outline: none;
}

@font-face {
  font-family: "Berlin Sans FB Demi";
  src: url("/font/BRLNSDB.ttf");
}
.berlin-sans {
  font-family: "Berlin Sans FB Demi", sans-serif;
}

// 画面遷移のアニメーション
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

// 少し遅くしたフェードアウト/フェードイン
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

// カプセル状のボタン
.btn-capsule {
  display: inline-block;
  width: 5rem;
  height: 1.5rem;
  padding: 0.25rem 0.75rem;
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  color: #113bad;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  border-radius: 20%/50%;
  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
  &:focus {
    outline: none;
  }
}
</style>
