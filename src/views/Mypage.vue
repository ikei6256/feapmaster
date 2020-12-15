<template>
  <div class="mypage">
    <!-- userInfoここから -->
    <div class="userInfo">
      <v-card>
        <v-list color="blue lighten-5">
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="currentUser.photoURL"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ currentUser.name }}</v-list-item-title>
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
        <div v-if="selectedItem === 0" key="mylist">マイリスト</div>

        <div v-else-if="selectedItem === 1" key="history-battle">
          <div>過去10戦 (2人対戦)</div>
          <v-divider></v-divider>

          <div v-if="battleRecords.length !== 0">
            <div v-for="(record, index) in battleRecords" :key="index" class="mt-2">
              <v-subheader>{{ record.createdAt.toDate() }}</v-subheader>
              <review :questions="record.questions" :myAns="record.myAnswers"></review>
            </div>
          </div>
        </div>

        <div v-else-if="selectedItem === 2" key="history-battle4">過去10戦 (4人対戦)</div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {
    review: () => import(/* webpackChunkName: "review" */ "../components/battle/Review.vue"),
  },
  data() {
    return {
      selectedItem: 1,
      items: [
        { text: "マイリスト", icon: "mdi-folder" },
        { text: "過去の10戦(2人対戦)", icon: "mdi-sword-cross" },
        { text: "過去の10戦(4人対戦)", icon: "mdi-sword-cross" },
      ],
      battleRecords: [],
    };
  },
  computed: {
    ...mapState(["currentUser", "db"]),
  },
  mounted() {
    // 戦績データを取得する
    // this.setBattleRecords();
  },
  methods: {
    setBattleRecords() {
      const battleResultsQuery = this.db
        .collection(`users/${this.currentUser.uid}/battleResult`)
        .orderBy("createdAt", "desc"); // 新しい順

      battleResultsQuery.get({ source: "cache" })
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            throw Error();
          }
          querySnapshot.forEach((queryDocumentSnapshot) => {
            this.battleRecords.push(queryDocumentSnapshot.data());
          });
        })
        .catch(() => {
          battleResultsQuery.get({ source: "server" })
            .then((querySnapshot) => {
              querySnapshot.forEach((queryDocumentSnapshot) => {
                this.battleRecords.push(queryDocumentSnapshot.data());
              });
            });
        });
    },
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

  .userInfo {
    grid-area: userInfo;
  }

  .userDetails {
    grid-area: detail;
  }
}
</style>
