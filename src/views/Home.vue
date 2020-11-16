<template>
  <div class="home">
    <header class="berlin-sans">
      <router-link class="login" :to="{ name: 'Login' }">Login</router-link>
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
          <a href="https://forms.gle/PLe5syon4VmYAZ7G8" target="_blank">ご意見・ご要望 <open-in-new-icon class="icon-external" /></a>
        </li>
      </ul>
    </nav>

    <footer>
      <span class="copyright">&copy; <span class="berlin-sans">FEAPMaster</span> 開発チーム</span>
      <a class="logo-firebase" href="https://firebase.google.com" target="_blank">
        <img src="/img/Built_with_Firebase_Logo_Light.png" alt="Firebase" />
      </a>
    </footer>
  </div>
</template>

<script>
import OpenInNewIcon from "vue-material-design-icons/OpenInNew.vue";
export default {
  components: {
    OpenInNewIcon,
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: "Berlin Sans FB Demi";
  src: url("/font/BRLNSDB.ttf");
}
.berlin-sans {
  font-family: "Berlin Sans FB Demi", sans-serif;
}
</style>

<style lang="scss" scoped>
* {
  line-height: 1;
}
ul {
  margin: 0;
}
a:hover {
  text-decoration: none;
}

.home {
  min-height: 100vh;
  min-width: 100vw;
  background-color: rgba(249, 182, 15, 0.75);
  display: grid;
  grid-template:
    "... ... ..." 1.5rem
    "... header ..."
    "... ... ..." 2.5rem
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
  color: #113BAD;
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
}
.select ul li {
  & a {
    font-size: 3rem;
    color: #4B79FA;
  }
  &.feedback {
    margin-top: 1rem;
    & a {
      font-size: 0.9rem;
    }
  }
}
.material-design-icon.icon-external {
  height: 0.9rem;
  width: 0.9rem;
}
.material-design-icon.icon-external > .material-design-icon__svg {
  height: 0.9rem;
  width: 0.9rem;
}

/***********
 * Footer
 ***********/
footer {
  grid-area: footer;
  display: grid;
  grid-template: "copy f-bland";
}
.copyright {
  grid-area: copy;
  align-self: center;
  font-size: 0.8rem;
  color: rgb(90, 90, 90);
}
.logo-firebase {
  grid-area: f-bland;
  justify-self: right;
}
.logo-firebase img {
  height: 3rem;
}
</style>
