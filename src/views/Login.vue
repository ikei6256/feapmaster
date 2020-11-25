<template>
  <v-container fluid class="login pa-0">
    <v-card class="area-login pa-0">
      <h1 class="login-title">ログイン / 新規登録</h1>
      <div id="firebaseui-auth-container"></div>
    </v-card>
  </v-container>
</template>

<script>
import firebase from "../firebase";
import * as firebaseui from "firebaseui-ja";
import "firebaseui-ja/dist/firebaseui.css";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["auth"]),
  },
  mounted() {
    // FirebaseUI config.
    const uiConfig = {
      // signInFlow: "popup",
      // signInSuccessUrl: "/",
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => {
          // console.log(authResult.user);
          return false; // ここでは遷移しない
        }
      }
    };

    // Initialize the FirebaseUI Widget using Firebase.
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.auth);
    // The start method will wait until the DOM is loaded.
    ui.start("#firebaseui-auth-container", uiConfig);
  },
};
</script>

<style>
ul.firebaseui-idp-list {
  padding-left: 0;
}
</style>

<style lang="scss" scoped>
.login {
  display: grid;
  grid-template:
    "... ... ..." 0.35fr
    "... area-login ..." minmax(500px, auto)
    "... ... ..." minmax(2rem, 1fr)
    / minmax(2%, auto) minmax(auto, 580px) minmax(2%, auto);
}
.area-login {
  grid-area: area-login;
  background-color: rgba(255, 255, 255, 0.3);
  text-align: center;
}
.login-title {
  margin-top: 5rem;
  margin-bottom: 3rem;
  color: #263238;
}
</style>
