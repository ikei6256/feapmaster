<template>
  <v-app>
    <div class="root">
      <header-component class="header-component" @signout="signout"></header-component>
      <transition name="fade" mode="out-in">
        <router-view class="area-contents" />
      </transition>
    </div>

    <!-- ログアウト時に出現するスナックバー -->
    <v-snackbar v-model="snackbar_auth" timeout="4750">
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
      /** **ユーザの初回チェックであれば画面遷移しない**
       * ゲストユーザで新規タブで対戦画面を開くと画面遷移してしまうのを防ぐ
       */
      FIRST_LOAD_USER: true,
      snackbar_auth: false,
    }
  },
  computed: {
    ...mapState(["auth", "db"]),
  },
  created() {
    this.db.enablePersistence({ synchronizeTabs: true });

    // ユーザ情報をセットする
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // signed in

        /** **ユーザ情報をセットするオブジェクト**
         * @type {object}
         * @prop {string} name 名前
         * @prop {string} email メール
         * @prop {number} level レベル
         * @prop {number} battle_win 2人対戦での勝利数
         * @prop {number} battle_lose 2人対戦での敗北数
         * @prop {number} battle4_1 4人対戦での1位取得数
         * @prop {number} battle4_2 4人対戦での2位取得数
         * @prop {number} battle4_3 4人対戦での3位取得数
         * @prop {number} battle4_4 4人対戦での4位取得数
         * @prop {string} uid
         * @prop {string} providerId
         */
        let userObj = {
          email: user.email,
        }
        const docRef = this.db.collection("users").doc(user.uid);

        docRef.get().then( (snapshot) => {
          // ユーザ情報がFirestoreに存在するかチェック
          if (snapshot.exists) {
            // データをコピー
            userObj = { ...userObj, ...snapshot.data() };
          } else {
            // ユーザ情報がFirestoreに無ければ新しく登録する
            userObj.level = 1;
            userObj.name = user.displayName;

            // 画像が無い場合はデフォルト画像
            userObj.photoURL = user.photoURL !== null ? user.photoURL :
              "https://firebasestorage.googleapis.com/v0/b/feapmaster-5b5ad.appspot.com/o/userImage%2Fno-image.png?alt=media&token=7eb5ca9d-911b-4871-9929-9aaae704867a";

            userObj.battle_win = 0;
            userObj.battle_lose = 0;
            userObj.battle_draw = 0;
            userObj.battle4_1 = 0;
            userObj.battle4_2 = 0;
            userObj.battle4_3 = 0;
            userObj.battle4_4 = 0;
            docRef.set(userObj);
          }

          // オブジェクトにUIDを追加してローカルに保存する
          userObj.uid = user.uid;
          userObj.providerId = user.providerData[0].providerId;
          this.setUser(userObj);

          // スナックバー出現
          this.snackbar_auth = true;

          // 現在の画面がログインページならホームへ遷移する
          if (this.$router.currentRoute.name === "Login") {
            this.$router.push({ name: "Home" });
          }
        }).catch((e) => {
          alert('エラーが発生しました。CODE:' + String(e.code));
        })
      } else {
        // signed out
        const page = this.$router.currentRoute.name;

        // 現在のページがマイページか対戦画面ならホームへ遷移する
        if (page === "Mypage") {
          this.$router.push({ name: "Home" });
        } else if ((page === "Battle" || page === "Battle4") && !this.FIRST_LOAD_USER) {
          this.stateBattleFalse(); // 対戦フラグOFF
          this.$router.push({ name: "Home" });
        }

        // ユーザ情報をリセットする
        this.unsetUser();
      }

      if(this.FIRST_LOAD_USER) {
        this.FIRST_LOAD_USER = false;
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
