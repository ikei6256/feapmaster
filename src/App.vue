<template>
  <v-app>
    <div class="root">
      <header-component class="header-component"></header-component>
      <transition name="fade" mode="out-in">
        <router-view class="contentsArea" />
      </transition>
    </div>
  </v-app>
</template>

<script>
import Header from "@/components/Header.vue";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    "header-component": Header,
  },
  computed: {
    ...mapState(["auth", "db"]),
  },
  methods: {
    ...mapMutations(["setUser", "unsetUser"]),
  },
  mounted() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // signed in

        const userObj = {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }
        const docRef = this.db.collection("users").doc(user.uid);

        docRef.get().then( (snapshot) => {
          // ユーザ情報がデータベースに存在するかチェックしてレベルを取得する
          if (snapshot.exists) {
            userObj.level = snapshot.data().level;
          } else {
            // ユーザ情報が無ければデータベースに新しく登録する
            userObj.level = 1;
            docRef.set(userObj);
          }

          // ローカルに保存する
          userObj.uid = user.uid;
          this.setUser(userObj);

          // 現在の画面がログインページならマイページへ遷移する
          if (this.$router.currentRoute.name === "Login") this.$router.push({ name: "Mypage" });
        })
      } else {
        // signed out

        // 現在のページがマイページならホームへ遷移する
        if (this.$router.currentRoute.name === "Mypage") this.$router.push({ name: "Home" });

        // ユーザ情報をリセットする
        this.unsetUser();
      }
    });
  },
};
</script>

<style lang="scss">
$background-color-main: #fac84b;
#app {
  font-family: Roboto, "Helvetica Neue", "Helvetica", "Arial", "Droid Sans", "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Meiryo", "Droid Sans Japanese", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: $background-color-main;
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

.contentsArea {
  grid-area: contents;
}
</style>
