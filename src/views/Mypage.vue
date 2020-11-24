<template>
  <div class="mypage">
    <!-- userInfoここから -->
    <div class="userInfo">
      <v-card>
        <v-list color="grey lighten-2">
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
        <v-list nav dense>
          <v-list-item-group v-model="selectedItem" color="orange darken-4" mandatory>
            <v-list-item v-for="(item, i) in items" :key="i">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </div>
    <!-- userInfoここまで -->

    <div class="userDetails">
      <transition name="fade" mode="out-in">
        <div v-if="selectedItem === 0" key="mylist" class="mylist white">マイリスト</div>
        <div v-else-if="selectedItem === 1" key="history" class="history white">履歴</div>
        <div v-else-if="selectedItem === 2" key="history-battle" class="history-battle white">過去10戦の履歴</div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    selectedItem: 0,
    items: [
      { text: "マイリスト", icon: "mdi-folder" },
      { text: "履歴", icon: "mdi-history" },
      { text: "過去10戦の成績", icon: "mdi-sword-cross" },
    ],
  }),
  watch: {
    selectedItem: function (val) {
      console.log(val);
    },
  },
  computed: {
    ...mapState(["currentUser"]),
  },
};
</script>

<style lang="scss" scoped>
.mypage {
  display: grid;
  grid-template:
    "... ... ..." 1rem
    "userInfo ... detail" 1fr
    / 250px 1rem 1fr;
}
.userInfo {
  grid-area: userInfo;
}
.userDetails {
  grid-area: detail;
}
</style>
