<template>
  <div class="root">
    <header class="berlin-sans">
      <transition v-if="isAuth != null" name="fade" mode="out-in">
        <router-link v-if="!isAuth" class="login" :to="{ name: 'Login' }"><button class="btn-capsule">Login</button></router-link>
        <span v-else><button class="btn-capsule" @click="logout">Logout</button></span>
      </transition>
    </header>
    <div class="logo">
      <img src="/img/logo.png" alt="FE AP Master" />
    </div>
    <nav class="select berlin-sans">
      <ul>
        <li>
          <router-link :to="{ name: 'Battle' }"> Battle <span class="arrow">></span></router-link>
        </li>
        <li class="feedback">
          <a href="https://forms.gle/PLe5syon4VmYAZ7G8" target="_blank">ご意見・ご要望 <v-icon>mdi-open-in-new</v-icon></a>
        </li>
      </ul>
    </nav>

    <footer>
      <span class="copyright">&copy; <span class="berlin-sans">FEAPMaster</span> 開発チーム</span>
      <a class="logo-firebase" href="https://firebase.google.com" target="_blank">
        <img src="/img/Built_with_Firebase_Logo_Light.png" alt="Firebase" />
      </a>
    </footer>
    <div class="notify-logout"><span class="notify-logout-text">ログアウトしました。</span></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      isAuth: null,
    };
  },
  computed: {
    ...mapState(["auth"]),
  },
  beforeMount() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // signed in
        this.isAuth = true;
      } else {
        // signed out
        this.isAuth = false;
      }
    });
  },
  methods: {
    logout() {
      const notify = document.getElementsByClassName("notify-logout")[0];
      this.auth.signOut();
      notify.classList.toggle("notify-logout-active");
      setTimeout(function () {
        notify.classList.remove("notify-logout-active");
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
.root {
  min-height: 100vh;
  min-width: 100vw;
  display: grid;
  grid-template:
    "... ... ..." 1.5rem
    "... header ..."
    "... ... ..." 2.2rem
    "... logo ..." minmax(auto, 10rem)
    "... ... ..." 0.2fr
    "... main-nav ..."
    "... ... ..." 1fr
    "... footer ..."
    "... ... ..." 1rem
    / minmax(4%, auto) minmax(auto, 1024px) minmax(4%, auto);
}

/***********
 * Header
 ***********/
header {
  grid-area: header;
  align-self: center;
  justify-self: right;
}
.login {
  color: #113bad;
}
.logo {
  grid-area: logo;
  text-align: center;
}
.logo img {
  max-height: 100%;
  max-width: 100%;
}
.select {
  grid-area: main-nav;
  text-align: center;
  ul {
    padding-left: 0;
  }
}
.select ul li {
  & a {
    font-size: 3rem;
    color: #4b79fa;
  }
  &.feedback {
    margin-top: 1rem;
    & a {
      font-size: 0.9rem;
    }
  }
}
i.v-icon.v-icon {
  color: inherit;
  font-size: 0.9rem;
  vertical-align: baseline;
}

/***********
 * Footer
 ***********/
footer {
  grid-area: footer;
  display: grid;
  grid-template: "firebase-bland copy";
}
.copyright {
  grid-area: copy;
  align-self: center;
  justify-self: right;
  font-size: 0.9rem;
  color: rgb(90, 90, 90);
}
.logo-firebase {
  grid-area: firebase-bland;
}
.logo-firebase img {
  height: 3rem;
}
</style>
