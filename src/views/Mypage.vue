<template>
  <div class="mypage">
    <!-- userInfoここから -->
    <div class="userInfo">
      <v-card>
        <v-list color="blue lighten-5">
          <v-list-item>
            <v-spacer></v-spacer>
            <div class="mt-2">
              <label>
                <v-hover v-slot="{ hover }">
                  <v-badge :value="hover" bordered overlap icon="mdi-wrench" color="grey darken-2">
                    <v-avatar v-ripple size="60" class="avatar">
                      <v-img cursor :src="currentUser.photoURL"></v-img>
                    </v-avatar>
                  </v-badge>
                </v-hover>
                <input type="file" @change="onFileChange" style="display:none"/>
              </label>
            </div>
            <v-spacer></v-spacer>
          </v-list-item>

          <v-list-item class="name_email" ripple>
            <v-list-item-content>
              <v-list-item-title>{{ currentUser.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ currentUser.email }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon right small>mdi-cog</v-icon>
            </v-list-item-action>
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

          <!-- <transition name="fade"> -->
          <div v-if="battleRecords === null" key="loading">
            <vue-loading type="bubbles" color="#FF9800" :size="{ width: '50px', height: '50px' }"></vue-loading>
          </div>
          <div v-else-if="Array.isArray(battleRecords) && battleRecords.length !== 0" key="battleRecords">
            <div v-for="(record, index) in battleRecords" :key="index" class="mt-2">
              <v-subheader>{{ record.createdAt.toDate() }}</v-subheader>
              <review :questions="record.questions" :myAns="record.myAnswers"></review>
            </div>
          </div>
          <div v-else-if="Array.isArray(battleRecords)" key="battleRecordsNone">
            <v-alert dense type="info" class="mt-2">対戦結果が登録されていません。</v-alert>
          </div>
          <div v-else-if="battleRecords === 'error'" key="error">
            <v-alert dense border="left" icon="mdi-alert" type="warning" class="mt-2">
              申し訳ございません。通信エラーが発生しています。しばらくの後にアクセスするか開発チームまでお問い合わせください。
            </v-alert>
          </div>
          <!-- </transition> -->
        </div>

        <div v-else-if="selectedItem === 2" key="history-battle4">過去10戦 (4人対戦)</div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { VueLoading } from "vue-loading-template";
export default {
  components: {
    VueLoading,
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
      battleRecords: null,
    };
  },
  computed: {
    ...mapState(["currentUser", "db", "sourceFromCache"]),
  },
  mounted() {
    // 戦績データを取得する
    // this.getBattleRecords();
  },
  methods: {
    ...mapMutations(["triedFromServer"]),

    /** ファイルを Firebase Storageにアップロードする */
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      console.log(files);
    },

    /** 2人対戦データを取得する */
    getBattleRecords() {
      const battleRecordsQuery = this.db.collection(`users/${this.currentUser.uid}/battleRecords`).orderBy("createdAt", "desc"); // 新しい順

      const source = this.sourceFromCache.battle_result ? "cache" : "server";

      // もしサーバーから取得したのであれば次回からはキャッシュを読み取る
      if (source === "server") {
        this.triedFromServer("battleRecords");
      }

      console.log("source:", source);

      battleRecordsQuery
        .get({ source: source })
        .then((querySnapshot) => {
          querySnapshot.forEach((queryDocumentSnapshot) => {
            this.battleRecords.push(queryDocumentSnapshot.data());
          });
        })
        .catch(() => {
          // キャッシュの取得に失敗した場合にサーバーから取得する
          battleRecordsQuery
            .get({ source: "server" })
            .then((querySnapshot) => {
              querySnapshot.forEach((queryDocumentSnapshot) => {
                this.battleRecords.push(queryDocumentSnapshot.data());
              });
            })
            .catch(() => {
              this.battleRecords = "error";
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

    // .avatar {
    //   cursor: pointer;
    // }

    .avatar,
    .name_email {
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }

  .userDetails {
    grid-area: detail;
  }
}
</style>
