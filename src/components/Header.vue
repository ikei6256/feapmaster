<template>
  <header>
    <div class="contents">
      <div class="logo">
        <router-link :to="{ name: 'Home' }">
          <!-- <span class="navbar-brand mb-0 h1">FEAPMaster</span> -->
          <img src="/img/logo.png" alt="FE AP Master" />
        </router-link>
      </div>
      <div class="menu berlin-sans">
        <router-link v-if="auth.currentUser == null" class="login" :to="{ name: 'Login' }"><button class="btn-capsule">Login</button></router-link>
        <span v-else><button class="btn-capsule">Logout</button></span>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["auth"]),
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
    height: 2rem;
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
