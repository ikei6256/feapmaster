<template>
  <div class="root">
    <header-component class="header"></header-component>
    <div class="area-login">
      <div class="login-box">
        <div class="login">
          <h1 class="title berlin-sans">Login</h1>
          <div id="firebaseui-auth-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import firebase from "../firebase";
import * as firebaseui from "firebaseui-ja";
import "firebaseui-ja/dist/firebaseui.css";
import { mapState } from "vuex";
export default {
  components: {
    "header-component": Header,
  },
  computed: {
    ...mapState(["auth"]),
  },
  mounted() {
    // FirebaseUI config.
    const uiConfig = {
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      // signInFlow: "popup",
      signInSuccessUrl: "/",
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
      ],
    };

    // Initialize the FirebaseUI Widget using Firebase.
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start("#firebaseui-auth-container", uiConfig);
    // if (ui.isPendingRedirect()) {
    //   ui.start("#firebaseui-auth-container", uiConfig);
    // }
  },
};
</script>

<style lang="scss" scoped>
.root {
  min-height: 100vh;
  min-width: 100vw;
  display: grid;
  // background-color: rgba(249, 182, 15, 0.5);
  grid-template:
    "header header header"
    "... ... ..." 0.4fr
    "... area-login ..." 65%
    "... ... ..." 1fr
    / minmax(4%, auto) minmax(auto, 1024px) minmax(4%, auto);
}
.header {
  grid-area: header;
}
.area-login {
  grid-area: area-login;
  display: grid;
  grid-template:
    "... login-box ..."
    / auto minmax(auto, 580px) auto;
}
.login-box {
  grid-area: login-box;
  display: grid;
  grid-template:
    "..." 0.5fr
    "login"
    "..." 1fr;
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0px 8px 16px -2px rgba(10, 10, 10, 0.1), 0px 0px 0px 1px rgba(10, 10, 10, 0.02);
}
.login {
  grid-area: login;
}
.title {
  text-align: center;
  margin-bottom: 2rem;
}
</style>
