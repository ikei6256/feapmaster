<template>
  <div class="home">
    <div class="logo px-1 px-md-0">
      <img src="/img/logo/logo.png" alt="FE AP Master" />
    </div>
    <v-list class="select py-0" style="background-color:inherit">
      <ul>
        <li class="berlin-sans">
          <router-link :to="{ name: 'Battle' }">Battle ></router-link>
        </li>
        <li class="feedback">
          <a href="https://forms.gle/PLe5syon4VmYAZ7G8" target="_blank">ご意見・ご要望 <v-icon class="icon-external">mdi-open-in-new</v-icon></a>
        </li>
      </ul>
    </v-list>

    <v-footer class="home-footer py-0 px-1 px-md-0" style="background-color:inherit">
      <div class="left">
        <a class="logo-firebase" href="https://firebase.google.com" target="_blank">
          <img src="/img/logo/Built_with_Firebase_Logo_Light.png" alt="Firebase" />
        </a>
        <a class="logo-github" href="https://github.com/ikei6256/feapmaster" target="_blank">
          <img src="/img/logo/GitHub-Mark-64px.png" alt="GitHub" />
        </a>
      </div>
      <span class="copyright">&copy; <span class="berlin-sans">FEAPMaster</span> 開発チーム</span>
    </v-footer>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  grid-template:
    "..." 0.15fr
    "logo"
    "..." 0.15fr
    "nav" 1fr
    "..." 0.15fr
    "footer"
    "..." 1rem;
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
    & a,
    .icon-external {
      font-size: 0.9rem;
    }
    .icon-external {
      color: inherit;
      vertical-align: baseline;
    }
  }
}

// Footer
$footer-height: 3rem;
.home-footer {
  grid-area: footer;
  display: grid;
  align-items: center;
  grid-template: "left copy" $footer-height;
}
.left {
  grid-area: left;
  display: grid;
  grid-template:
    "firebase ... github ..."
    / auto 0.5rem auto 1fr;

  .logo-firebase {
    grid-area: firebase;
    img {
      max-height: $footer-height;
    }
  }

  .logo-github {
    grid-area: github;
    display: table-cell;
    height: $footer-height;
    line-height: $footer-height;
    width: $footer-height;
    text-align: center;
    border-radius: 2px;
    img {
      max-height: $footer-height - 0.3rem;
      max-width: $footer-height - 0.3rem;
      vertical-align: middle;
    }
  }
}
.copyright {
  grid-area: copy;
  justify-self: right;
  font-size: 0.8rem;
  color: rgb(90, 90, 90);
}
</style>
