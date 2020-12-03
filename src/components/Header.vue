<template>
  <header>
    <transition name="fade">
      <div v-if="$route.name != 'Home'" class="logo">
        <router-link :to="{ name: 'Home' }">
          <img src="/img/logo/logo.png" alt="FE AP Master" />
        </router-link>
      </div>
    </transition>
    <div class="menu">
      <transition name="fade-200" mode="out-in">
        <v-btn v-if="currentUser === null && isPlaying === false" :to="{ name: 'Login' }" color="indigo" text class="font-weight-bold"
          >ログイン</v-btn
        >

        <v-menu v-else-if="currentUser !== null && isPlaying === false" open-on-hover bottom offset-y rounded>
          <template v-slot:activator="{ on }">
            <v-btn class="btn-user" v-on="on" text>
              <v-avatar color="#fff" size="2.4rem">
                <v-img :src="currentUser.photoURL" alt="User Photo"></v-img>
              </v-avatar>
              <v-icon small>mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <!-- ホバー時出現 -->
          <v-card min-width="200px">
            <v-list dense color="grey lighten-5">
              <v-list-item>
                <v-layout justify-center>
                  <v-list-item-avatar class="mr-0 mb-0" color="#fff">
                    <v-img :src="currentUser.photoURL"></v-img>
                  </v-list-item-avatar>
                </v-layout>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="userName text-center">{{ currentUser.name }}</v-list-item-title>
                  <v-list-item-subtitle class="text-center">{{ currentUser.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-content>
                  <v-btn :to="{ name: 'Mypage' }" text>マイページ</v-btn>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-btn color="red darken-2" text @click="logout">ログアウト</v-btn>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </transition>
    </div>

    <!-- ログアウト用のスナックバー -->
    <v-snackbar v-model="snackbar_logout" timeout="2800">
      ログアウトしました。
      <template v-slot:action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="snackbar_logout = false">
          <v-icon color="#FA3E7E">mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </header>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      snackbar_logout: false,
    };
  },
  computed: {
    ...mapState(["auth", "currentUser", "isPlaying"]),
  },
  methods: {
    logout() {
      this.auth.signOut().then(() => {
        this.snackbar_logout = true; // スナックバーを表示する
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$header-height: 2.5rem;

header {
  margin-top: 0.5rem;
  display: grid;
  grid-template:
    "logo ... menu" $header-height
    / auto 1fr auto;
  align-items: center;

  .logo {
    grid-area: logo;
    img {
      max-height: $header-height;
    }
  }

  .menu {
    grid-area: menu;
    justify-self: right;
    font-size: 14px;

    .btn-user {
      &.v-btn.v-btn {
        padding: 0;
      }

      .userPhoto {
      //   display: inline-flex;
      //   align-items: center;
      //   justify-content: center;
      //   border-radius: 50%;
      //   background-color: #fff;
      //   overflow: hidden;
        // height: $header-height - 0.3rem;
      //   width: $header-height - 0.3rem;
      //   img {
      //     display: inline-flex;
      //     height: inherit;
      //     width: inherit;
      //     //max-height: $header-height - 0.3rem;
      //   }
      }
    }
  }

  .userName {
    line-height: normal;
  }
}
</style>
