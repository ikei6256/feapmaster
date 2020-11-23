<template>
  <header>
    <transition name="fade">
      <div v-if="$route.name != 'Home'" class="logo">
        <router-link :to="{ name: 'Home' }">
          <img src="/img/logo.png" alt="FE AP Master" />
        </router-link>
      </div>
    </transition>
    <div class="menu">
      <transition name="fade-200" mode="out-in">
        <router-link v-if="currentUser === null" class="login" :to="{ name: 'Login' }">
          <v-btn color="blue darken-4" text rounded>ログイン</v-btn>
        </router-link>

        <v-menu v-else open-on-hover bottom offset-y rounded>
          <template v-slot:activator="{ on }">
            <v-btn class="avater" v-on="on" text>
              <img :src="currentUser.photoURL" alt="ユーザ画像" />
              <v-icon small>mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <!-- ホバー時出現 -->
          <v-card min-width="200px" color="grey lighten-5">
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img :src="currentUser.photoURL"></v-img>
                </v-list-item-avatar>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="title">{{ currentUser.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ currentUser.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>

            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <v-btn :to="{ name:'Mypage' }" text>マイページ</v-btn>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-btn color="pink" text @click="logout">ログアウト</v-btn>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </transition>
    </div>
  </header>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState(["auth", "currentUser"]),
  },
  methods: {
    ...mapMutations(["unsetUser"]),
    logout() {
      this.unsetUser();
      const notify = document.getElementsByClassName("notify-logout")[0];
      this.auth.signOut().then(() => {
        notify.classList.toggle("notify-logout-active");
        setTimeout(function () {
          notify.classList.remove("notify-logout-active");
        }, 2200);
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
}
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
  a {
    color: #113bad;
  }
  // ボタンの余白を消す
  .avater.v-btn.v-btn--flat,
  .v-btn__content {
    padding: 0;
    min-width: 0;
  }
}
.avater {
  img {
    border-radius: 50%;
    max-height: $header-height - 0.3rem;
  }
}
.myInfo {
  img {
    border-radius: 50%;
    max-height: $header-height;
  }
}
</style>
