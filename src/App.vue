<template>
  <v-app>
    <div class="root">
      <header-component class="header-component"></header-component>
      <transition name="fade" mode="out-in">
        <router-view class="contents" />
      </transition>
      <div class="notify-logout"><span class="notify-logout-text">ログアウトしました。</span></div>
    </div>
  </v-app>
</template>

<script>
import Header from "@/components/Header.vue";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    "header-component": Header,
  },
  computed: {
    ...mapState(["auth"]),
  },
  methods: {
    ...mapMutations(["setUser", "unsetUser"]),
  },
  mounted() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // signed in
        // ユーザ情報を設定する
        this.setUser({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
        });

        // 現在の画面がログインページならマイページへ遷移する
        if (this.$router.currentRoute.name === "Login") {
          this.$router.push({ name: "Mypage" });
        }
      } else {
        // signed out
        // 現在のページがマイページならホームへ遷移する
        if (this.$router.currentRoute.name === "Mypage") {
          this.$router.push({ name: "Home" });
        }
        // ユーザ情報をリセットする
        this.unsetUser();
      }
    });
  },
};
</script>

<style lang="scss">
* {
  line-height: 1;
  text-decoration: none;
}
img {
  vertical-align: middle;
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

// ログアウト通知
.notify-logout {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 0;
  box-sizing: border-box;
  color: #f5f5f5; // 「ログアウトしました」の文字色
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

<style lang="scss" scoped>
#app {
  font-family: Roboto, "verdana", "Helvetica Neue", "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", "Hiragino sans", "verdana", "Droid Sans",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: rgba(249, 182, 15, 0.75);
}
.root {
  min-height: 100vh;
  max-width: 100%;
  display: grid;
  grid-template:
    "... header ..."
    "... contents ..." 1fr
    / minmax(2%, auto) minmax(auto, 1024px) minmax(2%, auto);
}

.header-component {
  grid-area: header;
}

.contents {
  grid-area: contents;
}
</style>
