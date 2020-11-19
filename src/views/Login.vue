<template>
  <div class="container-md">
    <h1>ログイン</h1>
    <div id="signin" style="display: none">
      <p>ステータス：ログインしていません。</p>
      <!-- The surrounding HTML is left untouched by FirebaseUI.
      Your app may use that space for branding, controls and other customizations.-->
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
    </div>
    <div id="signout" style="display: none">
      <p>ステータス：ログインしています。</p>
      <button id="btn-signout" class="btn btn-outline-danger">ログアウト</button>
    </div>
  </div>
</template>

<script>
import firebase from "../firebase";
import * as firebaseui from "firebaseui";
var app = null;
export default {
  data() {
    return {
      //
      auth: null, // 認証情報
      firebaseUi: null,
    };
  },
  created() {
    this.auth = firebase.auth();
    app = this;
  },
  mounted() {
    app.auth.onAuthStateChanged(function (user) {
      // ここの処理が行われるまで画面をスピナーで隠しても良い
      if (user) {
        document.getElementById("signin").style.display = "none"; // サインイン消失
        document.getElementById("signout").style.display = "block"; // サインアウト出現
      } else {
        document.getElementById("signout").style.display = "none"; // サインアウト消失
        document.getElementById("signin").style.display = "block"; // サインイン出現
        app.loadFirebaseUi();
      }
    });

    // ログアウトボタン
    document.getElementById("btn-signout").onclick = function () {
      app.auth
        .signOut()
        .then(function () {
          // Sign-out successful.
          document.getElementById("signout").style.display = "none"; // サインアウト消失
          document.getElementById("signin").style.display = "block"; // サインイン出現
          app.loadFirebaseUi();
        })
    };
  }, // mounted
  // Start: beforeRouteLeave
  beforeRouteLeave(to, from, next) {
    // this.$unloadScript("https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth__ja.js")
    //   .then(function () {
    //     // unload script(Firebase UI)
    //   })
    //   .catch(function () {
    //     // failed to unload script(Firebase UI)
    //   });
    if (this.firebaseUi != null) {
      this.firebaseUi.delete();
      this.firebaseUi = null;
    }

    next();
  }, // End: beforeRouteLeave
  // Start: Methods
  methods: {
    // Start: loadFirebaseUi
    loadFirebaseUi() {
      // const app = this;

      this.$loadScript("https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth__ja.js")
        .then(function () {
          app.firebaseUi = new firebaseui.auth.AuthUI(app.auth);
          app.firebaseUi.start("#firebaseui-auth-container", {
            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            signInFlow: "popup",
            // signInSuccessUrl: '<url-to-redirect-to-on-success>',
            signInOptions: [
              // Leave the lines as is for the providers you want to offer your users.
              firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              firebase.auth.TwitterAuthProvider.PROVIDER_ID,
              firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
            ],
            callbacks: {
              uiShown: function () {
                // The widget is rendered.
                // Hide the loader.
                document.getElementById("loader").style.display = "none";
              },
              // signInSuccessWithAuthResultがtrueを返す時signInSuccessUrlがRequiredになる
              // signInSuccessWithAuthResult: function (authResult, redirectUrl) {
              signInSuccessWithAuthResult: function () {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                app.auth = firebase.auth();

                document.getElementById("signin").style.display = "none"; // サインイン消失
                document.getElementById("signout").style.display = "block"; // サインアウト出現

                app.firebaseUi.delete();
                app.firebaseUi = null;

                app
                  .$unloadScript("https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth__ja.js")
                  .then(function () {
                    // unload script(Firebase UI)
                  })
                  .catch(function () {
                    // failed to unload script(Firebase UI)
                  });

                // return true; // signInSuccessWithAuthResultがtrueを返す時redirectUrlが
              },
            },
          });
        })
        .catch(function () {
          // failed to load Firebase UI
        });
    }, // End: loadFirebaseUi
  }, // End: Methods
};
</script>

<style lang="scss" scoped>
@import url("https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth.css");
</style>
