<template>
  <header>
    <div class="header">
      <div class="logo"> <!-- v-show="$route.name != 'Home'" -->
        <router-link :to="{ name: 'Home' }">
          <img src="/img/logo.png" alt="FE AP Master" />
        </router-link>
      </div>
      <div class="menu berlin-sans">
        <router-link v-if="auth.currentUser == null" class="login" :to="{ name: 'Login' }"><button class="btn-capsule">Login</button></router-link>
        <span v-else><button class="btn-capsule" @click="logout">Logout</button></span>
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
  methods: {
    logout() {
      const notify = document.getElementsByClassName("notify-logout")[0];
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
header {
  display: grid;
  grid-template:
    "... ... ..." 0.5rem
    "... contents ..."
    "... ... ..." 0.5rem
    / minmax(4%, auto) minmax(auto, 1024px) minmax(4%, auto);
}
.contents {
  grid-area: contents;
  display: grid;
  grid-template: "logo menu";
  align-items: center;
}
.logo {
  grid-area: logo;
  img {
    display: inline-block;
    // height: 2.5rem;
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
