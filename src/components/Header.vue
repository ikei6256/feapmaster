<template>
  <header>
    <div class="header-contents">
      <div v-if="$route.name != 'Home'" class="logo">
        <router-link :to="{ name: 'Home' }">
          <img src="/img/logo.png" alt="FE AP Master" />
        </router-link>
      </div>
      <div class="menu">
        <transition name="fade-200" mode="out-in">
          <router-link v-if="!isAuth" class="login" :to="{ name: 'Login' }"><button class="btn-capsule">ログイン</button></router-link>
          <span v-else><button class="btn-capsule" @click="logout">ログアウト</button></span>
        </transition>
      </div>
    </div>
    <div class="notify-logout"><span class="notify-logout-text">ログアウトしました。</span></div>
  </header>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["auth"]),
  },
  props: {
    isAuth: Boolean,
  },
  methods: {
    logout() {
      const notify = document.getElementsByClassName("notify-logout")[0];
      this.auth.signOut();
      notify.classList.toggle("notify-logout-active");

      setTimeout(function () {
        notify.classList.remove("notify-logout-active");
        console.log();
      }, 2200);
    },
  },
};
</script>

<style lang="scss" scoped>
$header-height: 2.5rem;
header {
  margin-top: 0.3rem;
}
.header-contents {
  display: grid;
  grid-template:
    "logo ... menu" $header-height
    /auto 1fr auto;
  align-items: center;
}
.logo {
  grid-area: logo;
  img {
    max-height: $header-height;
  }
}
.menu {
  grid-area: menu;
  justify-self: right;
  font-size: 14px;
  a {
    color: #113bad;
  }
}
</style>
