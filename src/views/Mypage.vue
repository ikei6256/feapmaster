<template>
  <div class="mypage pb-2 pb-sm-4">
    <!-- userInfoここから -->
    <div class="userInfo">
      <v-card>
        <v-list color="blue lighten-5">
          <v-list-item>
            <v-spacer></v-spacer>
            <div class="mt-2">
              <v-hover v-slot="{ hover }">
                <label>
                  <v-badge :value="hover" overlap icon="mdi-wrench" color="grey darken-2">
                    <v-avatar v-ripple size="60" style="cursor: pointer" color="#fff">
                      <v-img :src="currentUser.photoURL"></v-img>
                      <v-overlay :value="hover" absolute opacity="0.6" style="font-size: 0.875rem">編集</v-overlay>
                    </v-avatar>
                  </v-badge>
                  <input type="file" @change="onFileChange" style="display: none" accept="image/*" />
                </label>
              </v-hover>
            </div>
            <v-spacer></v-spacer>
          </v-list-item>

          <v-hover v-slot="{ hover }">
            <v-list-item dense ripple style="cursor: pointer" @click="showModalEditProfile">
              <v-list-item-content>
                <v-list-item-title>{{ currentUser.name }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon right small>mdi-cog</v-icon>
              </v-list-item-action>
              <v-overlay absolute :value="hover" opacity="0.5" style="font-size: 0.875rem">編集する</v-overlay>
            </v-list-item>
          </v-hover>

          <v-list-item dense>
            <v-list-item-content>
                <v-list-item-subtitle>{{ currentUser.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <!-- todo:メールユーザは編集できるようにしたい -->

          <!-- <v-dialog v-model="isShowModalEditProfile" max-width="500px" hide-overlay>
            <template v-slot:activator="{ on, attrs }">
              <v-hover v-slot="{ hover }">
                <v-list-item ripple style="cursor: pointer" v-on="on" v-bind="attrs">
                  <v-list-item-content>
                    <v-list-item-title>{{ currentUser.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ currentUser.email }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon right small>mdi-cog</v-icon>
                  </v-list-item-action>
                  <v-overlay absolute :value="hover" opacity="0.5" style="font-size: 0.875rem">編集する</v-overlay>
                </v-list-item>
              </v-hover>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">プロフィール編集</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-text-field v-model="editName" label="名前"></v-text-field>
                  <v-text-field v-model="editMail" label="メール" hint="例: test@example.com" persistent-hint :rules="[v => /.+@.+/.test(v) || 'E-mail must be valid']" validate-on-blur></v-text-field>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-2" text @click="isShowModalEditProfile = false">キャンセル</v-btn>
                <v-btn color="blue darken-1" text @click="isShowModalEditProfile = false">編集する</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog> -->
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

          <transition name="fade">
            <div v-if="battleRecords === null" key="loading">
              <VueLoading type="bubbles" color="#FF9800" :size="{ width: '50px', height: '50px' }"></VueLoading>
            </div>
            <div v-else-if="Array.isArray(battleRecords) && battleRecords.length !== 0" key="battleRecords">
              <div v-for="(record, index) in battleRecords" :key="index" class="mt-2">
                <v-subheader>{{ record.createdAt.toDate() }}</v-subheader>
                <review :questions="record.questions" :myAns="record.myAnswers"></review>
              </div>
            </div>
            <div v-else-if="Array.isArray(battleRecords) && battleRecords.length === 0" key="battleRecordsNone">
              <v-alert dense type="info" class="mt-2">対戦結果が登録されていません。</v-alert>
            </div>
            <div v-else-if="battleRecords === 'error'" key="error">
              <v-alert dense border="left" icon="mdi-alert" type="warning" class="mt-2">
                申し訳ございません。通信エラーが発生しています。しばらくの後にアクセスするか開発チームまでお問い合わせください。
              </v-alert>
            </div>
          </transition>
        </div>

        <div v-else-if="selectedItem === 2" key="history-battle4">過去10戦 (4人対戦)</div>
      </transition>
    </div>

    <ModalAlert
      :isShow="isShowModalFailedUpload"
      :actionOk="true"
      :actionCancel="false"
      title_color="yellow lighten-2"
      title="アップロードに失敗しました。"
      text="アップロード可能な画像形式は PNG、JPG、GIF です。<br>ファイルサイズの上限は 2M byte です。"
      @hide="isShowModalFailedUpload = false"
    >
    </ModalAlert>
  </div>
</template>

<script>
import firebase from "../firebase";
import { mapState, mapMutations } from "vuex";
import { VueLoading } from "vue-loading-template";
export default {
  components: {
    VueLoading,
    review: () => import(/* webpackChunkName: "review" */ "../components/battle/Review.vue"),
    ModalAlert: () => import(/*webpackChunkName: "modalalert" */ "../components/ModalAlert.vue"),
  },
  data() {
    return {
      isShowModalFailedUpload: false,
      isShowModalEditProfile: false,
      editName: "",
      editMail: "",
      selectedItem: 0,
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
    ...mapMutations(["cacheServerData", "setUserPhoto"]),

    /** 入力されたファイルのバリデーションを行う */
    onFileChange(e) {
      // 入力されたファイルがなければ何もしない
      if (e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0] || e.dataTransfer.files[0];
      const fr = new FileReader();

      /** アップロード失敗時の処理 */
      const failedUpload = () => {
        this.isShowModalFailedUpload = true; // モーダル出現
        e.target.value = ""; // 入力したファイルをリセット
      };

      // 簡易バリデーション gif,jpeg,png 2M以下
      if (file.type.match(/image\/(gif|jpeg|png)/) === null || file.size > 2097152) {
        // アップロード失敗
        failedUpload();
        return;
      }

      // ファイルをアップロードする処理。file を Array Buffer 化した後に実行する。
      fr.onload = (e) => {
        const fileType = this.getImageFileType(e.target.result);

        if (fileType.match(/jpeg|png|gif/) !== null) {
          const imageRef = firebase.storage().ref().child(`userImage/${this.currentUser.uid}`);

          // アップロード処理
          imageRef
            .put(file)
            .then(() => {
              imageRef
                .getDownloadURL()
                .then((url) => {
                  // 自分のプロフィールに画像をセットする
                  this.db
                    .doc(`users/${this.currentUser.uid}`)
                    .update("photoURL", url)
                    .then(() => {
                      // ローカルに反映する
                      this.setUserPhoto({ url: url });
                    })
                    .catch(() => {
                      failedUpload();
                    });
                })
                .catch(() => {
                  failedUpload();
                });
            })
            .catch(() => {
              failedUpload();
            });
        } else {
          failedUpload();
        }

        fr.onload = null; // イベントリスナー破棄
      };

      // Array Buffer化
      fr.readAsArrayBuffer(file);
    },

    /** イメージのファイルタイプをバイナリーレベルで調べる */
    getImageFileType(arrayBuffer) {
      var ba = new Uint8Array(arrayBuffer);
      var headerStr = "";
      var headerHex = "";
      for (var i = 0; i < 10; i++) {
        // 始めの10個分を読む
        headerHex += ba[i].toString(16); // 16進文字列で読む
        headerStr += String.fromCharCode(ba[i]); // 文字列で読む
      }
      var fileType = "unknown";
      if (headerHex.indexOf("ffd8") != -1) {
        // JPGはヘッダーに「ffd8」を含む
        fileType = "jpeg";
      } else if (headerStr.indexOf("PNG") != -1) {
        // PNGはヘッダーに「PNG」を含む
        fileType = "png";
      } else if (headerStr.indexOf("GIF") != -1) {
        // GIFはヘッダーに「GIF」を含む
        fileType = "gif";
      }
      return fileType;
    }, //END getImageFileType()

    /** 2人対戦データを取得する */
    getBattleRecords() {
      const battleRecordsQuery = this.db.collection(`users/${this.currentUser.uid}/battleRecords`).orderBy("createdAt", "desc"); // 新しい順

      const source = this.sourceFromCache.battleRecords ? "cache" : "server";

      // もしサーバーから取得したのであれば次回からはキャッシュを読み取る
      if (source === "server") {
        this.cacheServerData("battleRecords");
      }

      battleRecordsQuery
        .get({ source: source })
        .then((querySnapshot) => {
          this.battleRecords = [];
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
  }

  .userDetails {
    grid-area: detail;
  }
}
</style>
