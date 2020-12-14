<template>
  <v-app>
    <div class="root">
      <header-component class="header-component" @signout="signout"></header-component>
      <transition name="fade" mode="out-in">
        <router-view class="area-contents" />
      </transition>
    </div>

    <!-- ログアウト時に出現するスナックバー -->
    <v-snackbar v-model="snackbar_auth" timeout="5000">
      <span v-if="auth.currentUser !== null">ログインしました。</span>
      <span v-else>ログアウトしました。</span>
      <template v-slot:action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="snackbar_auth = false">
          <v-icon color="#FA3E7E">mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

  </v-app>
</template>

<script>
import Header from "@/components/Header.vue";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    "header-component": Header,
  },
  data() {
    return {
      snackbar_auth: false,
    }
  },
  computed: {
    ...mapState(["auth", "db"]),
  },
  mounted() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // signed in

        const userObj = {
          email: user.email,
        }
        const docRef = this.db.collection("users").doc(user.uid);

        docRef.get().then( (snapshot) => {
          // ユーザ情報がFirestoreに存在するかチェック
          if (snapshot.exists) {
            userObj.level = snapshot.data().level;
            userObj.name = snapshot.data().name;
            userObj.photoURL = snapshot.data().photoURL;
          } else {
            // ユーザ情報がFirestoreに無ければ新しく登録する
            userObj.level = 1;
            userObj.name = user.displayName;
            // 画像があるかチェックする
            if (user.photoURL === null) {
              // 画像が無い場合はデフォルトの画像
              userObj.photoURL = "https://firebasestorage.googleapis.com/v0/b/feapmaster-5b5ad.appspot.com/o/userImage%2Fno-image.png?alt=media&token=7eb5ca9d-911b-4871-9929-9aaae704867a";
            } else {
              userObj.photoURL = user.photoURL;
            }
            docRef.set(userObj);
          }

          // ローカルに保存する
          userObj.uid = user.uid;
          this.setUser(userObj);

          // スナックバー出現
          this.snackbar_auth = true;

          // 現在の画面がログインページならホームへ遷移する
          if (this.$router.currentRoute.name === "Login") {
            this.$router.push({ name: "Home" });
          }
        })
      } else {
        // signed out
        const page = this.$router.currentRoute.name;

        // 現在のページがマイページか対戦画面ならホームへ遷移する
        if (page === "Mypage") {
          this.$router.push({ name: "Home" });
        } else if (page === "Battle" || page === "Battle4" ) {
          this.stateBattleFalse(); // 対戦フラグOFF
          this.$router.push({ name: "Home" });
        }

        // ユーザ情報をリセットする
        this.unsetUser();
      }
    });
  },
  methods: {
    ...mapMutations(["setUser", "unsetUser", "stateBattleFalse"]),
    signout() {
      this.auth.signOut().then(() => {
        this.snackbar_auth = true; // スナックバー出現
      })
    }
  },
};
</script>

<style lang="scss">
#app {
  font-family: Roboto, "Helvetica Neue", "Helvetica", "Arial", "Droid Sans", "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Meiryo", "Droid Sans Japanese", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #fac84b;
}
.rotate-45 {
  transform: rotate(45deg);
}
</style>

<style lang="scss" scoped>
.root {
  min-height: 100vh;
  display: grid;
  grid-template:
    "... header ..."
    "... contents ..." 1fr
    / auto minmax(auto, 1024px) auto;
}

.header-component {
  grid-area: header;
}

.area-contents {
  grid-area: contents;
}
</style>
