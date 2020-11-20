<template>
  <header>
    <header>
      <div v-if="$route.name != 'Home'" class="logo">
        <router-link :to="{ name: 'Home' }">
          <img src="/img/logo.png" alt="FE AP Master" />
        </router-link>
      </div>
      <div class="menu berlin-sans">
        <transition name="fade">
          <router-link v-if="!isAuth" class="login" :to="{ name: 'Login' }"><button class="btn-capsule">Login</button></router-link>
          <span v-else><button class="btn-capsule" @click="logout">Logout</button></span>
        </transition>
      </div>
    </header>
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
.header {
  display: grid;
  grid-template:
    "... ... ..." 0.3rem
    "... contents ..." $header-height
    / minmax(2%, auto) minmax(auto, 1024px) minmax(2%, auto);
}
header {
  grid-area: contents;
  display: grid;
  grid-template:
    "logo ... menu"
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
  line-height: 1;
  grid-area: menu;
  justify-self: right;
  a {
    color: #113bad;
  }
}
</style>
