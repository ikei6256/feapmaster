<template>
  <div class="home">
    <header>

    </header>
    <div class="logo">
      <img src="/img/logo.png" alt="FE AP Master" />
    </div>
    <div class="select">
      <router-link :to="{ name: 'Battle' }">
        <span>Battle <span class="arrow">></span></span><br>
      </router-link>
      <a href="https://forms.gle/PLe5syon4VmYAZ7G8" target="_blank">
        <span class="small">ご意見・ご要望</span>
      </a>
    </div>
    <footer>
      <span class="copyright">&copy; FEAPMaster 開発チーム</span>
      <div class="logo-firebase">
        <a href="https://firebase.google.com" target="_blank">
          <img src="/img/Built_with_Firebase_Logo_Light.png" alt="Firebase" />
        </a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {};
</script>

<style>
@font-face {
  font-family: "Berlin Sans FB Demi";
  src: url("/font/BRLNSDB.ttf");
}
</style>

<style lang="scss" scoped>
* {
  line-height: 1;
}
a:hover {
  text-decoration: none;
}
div.home {
  height: 100vh;
  width: 100vw;
  background-color: rgba(249, 182, 15, 0.75);
  display: grid;
  grid-template:
    "header header header" 5%
    "... ... ..." 5%
    "... logo ..." minmax(auto, 10rem)
    "... ... ..." 0.2fr
    "... nav ..."
    "... ... ..." 1fr
    "... footer ..."
    "... ... ..." 1rem
    / 10% auto 10%;
}
header {
  grid-area: header;
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
  grid-area: nav;
  text-align: center;
  font-size: 3rem;
  font-family: "Berlin Sans FB Demi", sans-serif;
  overflow: hidden;
}
.select a {
  font-size: 0;
}
.select span {
  font-size: 3rem;
}
.select .arrow {
  font-size: 2rem;
}
.select .small {
  font-size: 1rem;
}
footer {
  grid-area: footer;
  position: relative;
}
.copyright {
  position: absolute;
  top: calc(50% - 0.9rem / 2);
  left: 0;
  font-size: 0.9rem;
  color: rgba(48, 48, 48, 0.9);
}
.logo-firebase a {
  font-size: 0;
}
.logo-firebase img {
  float: right;
  height: 3.2rem;
}
</style>
