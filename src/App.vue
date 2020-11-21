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
* {
  line-height: 1;
  text-decoration: none;
}
img {
  vertical-align: middle;
}
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Roboto, "verdana", "Helvetica Neue", "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", "Hiragino sans", "verdana", "Droid Sans", sans-serif;
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

.berlin-sans {
  font-family: "Berlin Sans FB Demi", sans-serif;
  @at-root {
    @font-face {
      font-family: "Berlin Sans FB Demi";
      src: url("/font/BRLNSDB.ttf");
    }
  }
}

// 画面遷移のアニメーション (フェードイン/フェードアウト)
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

// フェードイン/フェードアウト 200ms
.fade-200 {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.1s ease-in-out;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}

// カプセル状のボタン
.btn-capsule {
  display: inline-block;
  min-width: 5rem;
  height: 1.5rem;
  padding: 0.25rem 0.75rem;
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  color: #113bad;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  border-radius: 15%/50%;
  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
  &:focus {
    outline: none;
  }
}

// ログアウト通知
.notify-logout {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 0;
  box-sizing: border-box;
  color: white;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  box-sizing: border-box;
  transition: height 0.2s;
}
.notify-logout-active {
  height: 3rem;
}
.notify-logout-text {
  display: inline-block;
  margin-top: 1rem;
}
</style>
