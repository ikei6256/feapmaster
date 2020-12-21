<template>
  <div class="mypage pb-4 pb-sm-8">
    <!-- トップへ戻るボタン -->
    <transition name="btn-fade">
      <v-btn v-scroll="onScroll" v-show="isShowBtnScroll" fab color="primary" fixed bottom right @click="$vuetify.goTo(0)">
        <v-icon small>mdi-arrow-up</v-icon>
      </v-btn>
    </transition>

    <!-- userInfoここから -->
    <div class="userInfo">
      <v-card class="userInfo-card">
        <div class="blue lighten-5">
          <div class="userInfo-top px-2 pt-3">
            <div class="userInfo-top-avatar pl-1">
              <v-hover v-slot="{ hover }">
                <label>
                  <v-avatar v-ripple size="60" style="cursor: pointer" color="#fff">
                    <v-img :src="currentUser.photoURL"></v-img>
                    <v-overlay :value="hover" absolute opacity="0.6" style="font-size: 0.8rem">編集</v-overlay>
                  </v-avatar>
                  <input type="file" @change="onFileChange" style="display: none" accept="image/*" />
                </label>
              </v-hover>
            </div>

            <v-dialog v-model="isShowModalEditName" max-width="500px" hide-overlay>
              <template v-slot:activator="{ on }">
                <v-hover v-slot="{ hover }">
                  <div class="userInfo-top-userName my-auto ml-2" v-ripple v-on="on">
                    <div class="userName py-1">
                      {{ currentUser.name }}
                    </div>
                    <v-icon class="config" size="0.8rem">mdi-cog</v-icon>
                    <v-overlay :value="hover" absolute style="font-size: 0.8rem">編集する</v-overlay>
                  </div>
                </v-hover>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">名前変更</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-text-field v-model="inputEditName" :disabled="disableEditProfile" label="名前"></v-text-field>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey darken-2" text @click="isShowModalEditName = false">キャンセル</v-btn>
                  <v-btn
                    @click="editName"
                    :loading="loadingEditProfile"
                    :disabled="disableEditProfile || inputEditName.length === 0"
                    color="blue darken-1"
                    text
                    >変更する</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>

          <div v-if="currentUser.providerId !== 'password'" class="userInfo-mail grey--text text--darken-2 py-3 pl-3 pr-2">
            <span class="pl-1">{{ currentUser.email }}</span>
          </div>

          <div v-else class="py-2 pl-3 pr-2">
            <v-dialog v-model="isShowModalEditEmail" max-width="500px" hide-overlay>
              <template v-slot:activator="{ on }">
                <v-hover v-slot="{ hover }">
                  <div class="userInfo-mail userInfo-mail-enableEdit grey--text text--darken-2 py-1" v-ripple v-on="on">
                    <span class="mail pl-1">{{ currentUser.email }}</span>
                    <v-icon class="config" size="0.75rem">mdi-cog</v-icon>
                    <v-overlay :value="hover" absolute style="font-size: 0.75rem">編集する</v-overlay>
                  </div>
                </v-hover>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">メール変更</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-text-field
                      v-model="inputEditEmail"
                      label="メール"
                      hint="例: test@example.com"
                      persistent-hint
                      :rules="[RULES_EMAIL.required, RULES_EMAIL.regex]"
                      :disabled="disableEditProfile"
                      validate-on-blur
                    ></v-text-field>
                    <v-text-field
                      v-model="inputPassword"
                      label="パスワード"
                      :append-icon="isVisiblePassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="isVisiblePassword ? 'text' : 'password'"
                      :rules="[(v) => !!v || '必須項目です。']"
                      :disabled="disableEditProfile"
                      counter
                      @click:append="isVisiblePassword = !isVisiblePassword"
                      validate-on-blur
                    >
                    </v-text-field>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey darken-2" text @click="isShowModalEditEmail = false">キャンセル</v-btn>
                  <v-btn
                    @click="editEmail"
                    :loading="loadingEditProfile"
                    :disabled="
                      disableEditProfile || inputEditEmail.length === 0 || inputEditEmail === currentUser.email || inputPassword.length === 0
                    "
                    color="blue darken-1"
                    text
                    >変更する</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>

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
        <!-- マイ問題集 -->
        <div v-if="selectedItem === 0" key="mylist">
          <h1 class="userDetails-headline blue-grey--text text--darken-4 my-2 mb-6 px-2">
            <v-icon>mdi-folder</v-icon>
            <span class="ml-2">マイ問題集</span>
          </h1>

          <v-card>
            <v-tabs v-model="activeTab" grow>
              <v-tabs-slider color="grey"></v-tabs-slider>
              <v-tab :class="activeTab === 0 ? 'blue darken-1 white--text' : 'blue lighten-5'">FE</v-tab>
              <v-tab :class="activeTab === 1 ? 'red lighten-1 white--text' : 'red lighten-5'">AP</v-tab>
            </v-tabs>

            <v-tabs-items v-model="activeTab">
              <v-tab-item>
                <v-list v-if="myLists.length !== 0" dense>
                  <v-subheader>FE</v-subheader>
                  <v-list-group v-for="(myList, index) in myLists" :key="index" no-action color="blue darken-1">
                    <template v-slot:activator>
                      <v-icon class="mr-2">mdi-folder</v-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="myList.listName"></v-list-item-title>
                      </v-list-item-content>
                    </template>

                    <div class="pa-2">
                      <!-- <v-expansion-panels accordion multiple>
                        <v-expansion-panel v-for="(item, i) in 5" :key="i">
                          <v-expansion-panel-header color="blue lighten-5"> Item </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels> -->
                    </div>
                  </v-list-group>
                </v-list>

                <div v-else>
                  <div class="px-2 pt-2">
                    <v-alert type="warning" dense icon="mdi-alert"> マイ問題集(FE)に問題が登録されていません。 </v-alert>
                  </div>
                </div>
              </v-tab-item>
              <v-tab-item>
                <v-list v-if="myListsAP.length !== 0" dense>
                  <v-subheader>AP</v-subheader>
                  <v-list-group v-for="(myList, index) in myListsAP" :key="index" no-action color="red lighten-1">
                    <template v-slot:activator>
                      <v-icon class="mr-2">mdi-folder</v-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="myList.listName"></v-list-item-title>
                      </v-list-item-content>
                    </template>

                    <div class="pa-2">
                      <!-- <v-expansion-panels>
                        <v-expansion-panel v-for="(item, i) in 5" :key="i">
                          <v-expansion-panel-header> Item </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels> -->
                    </div>
                  </v-list-group>
                </v-list>

                <div v-else>
                  <div class="px-2 pt-2">
                    <v-alert type="warning" dense icon="mdi-alert"> マイ問題集(AP)に問題が登録されていません。 </v-alert>
                  </div>
                </div>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </div>

        <!-- 2人対戦データ -->
        <div v-else-if="selectedItem === 1" key="history-battle">
          <h1 class="userDetails-headline blue-grey--text text--darken-4 my-2 mb-6 px-2">
            <v-icon>mdi-sword-cross</v-icon>
            <span class="ml-2">過去10戦 (2人対戦)</span>
          </h1>

          <transition name="fade" mode="out-in">
            <div v-if="battleRecords === null" key="loading">
              <VueLoading type="bubbles" color="#FF9800" :size="{ width: '50px', height: '50px' }"></VueLoading>
            </div>
            <div v-else-if="Array.isArray(battleRecords) && battleRecords.length !== 0" key="battleRecords">
              <div v-for="(record, index) in battleRecords" :key="index" class="mt-2 mt-sm-4">
                <v-subheader
                  >▽
                  <v-chip v-if="record.result == 'win'" class="mx-1" color="red" text-color="white" x-small>勝ち</v-chip>
                  <v-chip v-else-if="record.result == 'lose'" class="mx-1" color="blue" text-color="white" x-small>負け</v-chip>
                  <v-chip v-else class="mx-1" color="green" text-color="white" x-small>引き分け</v-chip>
                  {{ record.createdAt.toDate() | formatDate }}
                  vs.
                  <span class="opp_name">{{ record.opp_name }}</span>
                  <v-tooltip top nudge-bottom="10">
                    <template v-slot:activator="{ on, attrs }">
                      <v-avatar class="ml-1" size="28" color="white" v-on="on" v-bind="attrs">
                        <v-img :src="record.opp_photoURL"></v-img>
                      </v-avatar>
                    </template>
                    <span>{{ record.opp_name }}</span>
                  </v-tooltip>
                </v-subheader>
                <review :questions="record.questions" :myAns="record.myAnswers"></review>
              </div>
            </div>
            <div v-else-if="Array.isArray(battleRecords) && battleRecords.length === 0" key="battleRecordsNone">
              <v-alert class="userDetails-alert mt-2" type="info" dense>対戦結果が登録されていません。</v-alert>
            </div>
            <div v-else-if="battleRecords === 'error'" key="error">
              <v-alert class="userDetails-alert mt-2" type="warning" dense icon="mdi-alert">通信エラー</v-alert>
            </div>
          </transition>
        </div>

        <!-- 4人対戦データ -->
        <div v-else-if="selectedItem === 2" key="history-battle4">
          <h1 class="userDetails-headline blue-grey--text text--darken-4 my-2 mb-6 px-2">
            <v-icon>mdi-sword-cross</v-icon>
            <span class="ml-2">過去10戦 (4人対戦)</span>
          </h1>

          <transition name="fade" mode="out-in">
            <div v-if="battleRecords4 === null" key="loading">
              <VueLoading type="bubbles" color="#FF9800" :size="{ width: '50px', height: '50px' }"></VueLoading>
            </div>

            <div v-else-if="Array.isArray(battleRecords4) && battleRecords4.length !== 0" key="battleRecords">
              <div v-for="(record, index) in battleRecords4" :key="index" class="mt-2 mt-sm-4">
                <v-subheader
                  >▽

                  <v-chip class="mx-1" color="pink" text-color="white" x-small>{{ record.rank }}位</v-chip>
                  {{ record.createdAt.toDate() | formatDate }}
                  vs.
                  <span class="opp_name d-none d-md-flex">{{ record.opp1_name }}</span>
                  <v-tooltip top nudge-bottom="10">
                    <template v-slot:activator="{ on, attrs }">
                      <v-avatar class="ml-1 mr-3" size="28" color="white" v-on="on" v-bind="attrs">
                        <v-img :src="record.opp1_photoURL"></v-img>
                      </v-avatar>
                    </template>
                    <span>{{ record.opp1_name }}</span>
                  </v-tooltip>
                  <span class="opp_name d-none d-md-flex">{{ record.opp2_name }}</span>
                  <v-tooltip top nudge-bottom="10">
                    <template v-slot:activator="{ on, attrs }">
                      <v-avatar class="ml-1 mr-3" size="28" color="white" v-on="on" v-bind="attrs">
                        <v-img :src="record.opp2_photoURL"></v-img>
                      </v-avatar>
                    </template>
                    <span>{{ record.opp2_name }}</span>
                  </v-tooltip>
                  <span class="opp_name d-none d-md-flex">{{ record.opp3_name }}</span>
                  <v-tooltip top nudge-bottom="10">
                    <template v-slot:activator="{ on, attrs }">
                      <v-avatar class="ml-1" size="28" color="white" v-on="on" v-bind="attrs">
                        <v-img :src="record.opp3_photoURL"></v-img>
                      </v-avatar>
                    </template>
                    <span>{{ record.opp3_name }}</span>
                  </v-tooltip>
                </v-subheader>

                <review :questions="record.questions" :myAns="record.myAnswers"></review>
              </div>
            </div>

            <div v-else-if="Array.isArray(battleRecords4) && battleRecords4.length === 0" key="battleRecordsNone">
              <v-alert class="userDetails-alert mt-2" type="info" dense>対戦結果が登録されていません。</v-alert>
            </div>

            <div v-else-if="battleRecords4 === 'error'" key="error">
              <v-alert class="userDetails-alert mt-2" type="warning" dense icon="mdi-alert">通信エラー</v-alert>
            </div>
          </transition>
        </div>
      </transition>
    </div>

    <ModalAlert
      :isShow="isShowModalAlert"
      :actionOk="true"
      :actionCancel="false"
      title_color="yellow lighten-2"
      :title="modalAlertTitle"
      :text="modalAlertText"
      @hide="isShowModalAlert = false"
    >
    </ModalAlert>

    <Snackbar :isShow="isShowSnackbar" :text="snackbarText" @close="isShowSnackbar = false"></Snackbar>
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
    ModalAlert: () => import(/* webpackChunkName: "modalalert" */ "../components/ModalAlert.vue"),
    Snackbar: () => import(/* webpackChunName: "snackbar" */ "../components/Snackbar.vue"),
  },
  data() {
    return {
      isShowModalAlert: false,
      modalAlertTitle: "",
      modalAlertText: "",

      /** 名前編集ウィンドウの表示 */
      isShowModalEditName: false,

      /** メール編集ウィンドウの表示 */
      isShowModalEditEmail: false,
      validEditEmail: true,
      RULES_EMAIL: {
        required: (v) => !!v || "必須項目です。",
        regex: (v) =>
          /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "無効な形式です。例: test@example.com",
      },

      isShowSnackbar: false,
      snackbarText: "",

      inputEditName: "",
      inputEditEmail: "",
      inputPassword: "",
      disableEditProfile: false,
      loadingEditProfile: false,
      isVisiblePassword: false,

      isShowBtnScroll: false,

      selectedItem: 0,
      items: [
        { text: "マイ問題集", icon: "mdi-folder" },
        { text: "過去10戦(2人対戦)", icon: "mdi-sword-cross" },
        { text: "過去10戦(4人対戦)", icon: "mdi-sword-cross" },
      ],
      myLists: [],
      myListsAP: [],
      battleRecords: null,
      battleRecords4: null,

      activeTab: 0,
    };
  },
  computed: {
    ...mapState(["auth", "currentUser", "db", "sourceFromCache"]),
  },
  mounted() {
    // 戦績データを取得する
    this.getBattleRecords();

    // マイ問題集を取得する
    this.getMyLists();
  },
  filters: {
    /** 日付をフォーマットする */
    formatDate(date) {
      return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" + date.getHours() + "時" + date.getMinutes() + "分";
    },
  },
  methods: {
    ...mapMutations(["cacheServerData", "setUserPhoto", "setUserName", "setUserEmail"]),

    /** スクロールイベントを取得する関数 */
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.isShowBtnScroll = top > 500;
    },

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
        this.modalAlertTitle = "アップロードに失敗しました。";
        this.modalAlertText = "アップロード可能な画像形式は PNG、JPG、GIF です。<br>ファイルサイズの上限は 2M byte です。";
        this.isShowModalAlert = true; // モーダル出現
        e.target.value = ""; // 入力したファイルをリセット
      };

      // 簡易バリデーション gif,jpeg,png 2M以下
      if (file.type.match(/image\/(gif|jpeg|png)/) === null || file.size > 2097152) {
        // アップロード失敗
        failedUpload();
        return;
      }

      // ファイルをアップロードする処理
      // file を Array Buffer 化した後に実行する
      fr.onload = (e) => {
        const fileType = this.getImageFileType(e.target.result);

        if (fileType.match(/jpeg|png|gif/) !== null) {
          const imageRef = firebase.storage().ref().child(`userImage/${this.currentUser.uid}`);

          // アップロード処理
          imageRef
            .put(file)
            .then(() => {
              // アップロード完了
              // 画像URLを取得する
              imageRef
                .getDownloadURL()
                .then((photoURL) => {
                  // 自分のプロフィールに画像をセットする
                  this.db
                    .doc(`users/${this.currentUser.uid}`)
                    .update("photoURL", photoURL)
                    .then(() => {
                      // ローカルに反映する
                      this.setUserPhoto({ photoURL: photoURL });
                      this.snackbarText = "画像を変更しました。";
                      this.isShowSnackbar = true;
                      setTimeout(() => {
                        this.isShowSnackbar = false;
                      }, 4000);
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

    /** 2人対戦、4人対戦データを取得する */
    getBattleRecords() {
      const battleRecordsQuery = this.db.collection(`users/${this.currentUser.uid}/battleRecords`).orderBy("createdAt", "desc").limit(10); // 新しい順10件まで
      const battleRecords4Query = this.db.collection(`users/${this.currentUser.uid}/battleRecords4`).orderBy("createdAt", "desc").limit(10); // 新しい順10件まで

      // キャッシュ or サーバ
      const source = this.sourceFromCache.battleRecords ? "cache" : "server";
      const source4 = this.sourceFromCache.battleRecords4 ? "cache" : "server";

      // 1度サーバから取得していれば次回からはキャッシュを読み取る
      if (source === "server") this.cacheServerData("battleRecords");
      if (source4 === "server") this.cacheServerData("battleRecords4");

      // 2人対戦データ取得
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
              this.battleRecords = [];
              querySnapshot.forEach((queryDocumentSnapshot) => {
                this.battleRecords.push(queryDocumentSnapshot.data());
              });
            })
            .catch(() => {
              this.battleRecords = "error";
            });
        });

      // 4人対戦データ取得
      battleRecords4Query
        .get({ source: source4 })
        .then((querySnapshot) => {
          this.battleRecords4 = [];
          querySnapshot.forEach((queryDocumentSnapshot) => {
            this.battleRecords4.push(queryDocumentSnapshot.data());
          });
        })
        .catch(() => {
          // キャッシュの取得に失敗した場合にサーバーから取得する
          battleRecords4Query
            .get({ source: "server" })
            .then((querySnapshot) => {
              this.battleRecords4 = [];
              querySnapshot.forEach((queryDocumentSnapshot) => {
                this.battleRecords4.push(queryDocumentSnapshot.data());
              });
            })
            .catch(() => {
              this.battleRecords4 = "error";
            });
        });
    },

    /** マイリストを取得する */
    getMyLists() {
      const myListsCollection = this.db.collection(`users/${this.currentUser.uid}/myLists`);
      const myListsAPCollection = this.db.collection(`users/${this.currentUser.uid}/myListsAP`);

      // キャッシュ or サーバ
      const source = this.sourceFromCache.myLists ? "cache" : "server";
      const sourceAP = this.sourceFromCache.myListsAP ? "cache" : "server";

      // 1度サーバから取得していれば次回からはキャッシュを読み取る
      if (source === "server") this.cacheServerData("myLists");
      if (sourceAP === "server") this.cacheServerData("myListsAP");

      // myLists取得
      myListsCollection
        .get({ source: source })
        .then((querySnapshot) => {
          querySnapshot.forEach((queryDocumentSnapshot) => {
            this.myLists.push(queryDocumentSnapshot.data());
          });
          this.getQuestion();
        })
        .catch(() => {
          // キャッシュの取得に失敗した場合にサーバから取得する
          myListsCollection
            .get({ source: "server" })
            .then((querySnapshot) => {
              querySnapshot.forEach((queryDocumentSnapshot) => {
                this.myLists.push(queryDocumentSnapshot.data());
              });
              this.getQuestionAP();
            })
            .catch(() => {
              alert("エラーが発生しました。");
            });
        });

      // myListsAP取得
      myListsAPCollection
        .get({ source: sourceAP })
        .then((querySnapshot) => {
          querySnapshot.forEach((queryDocumentSnapshot) => {
            this.myListsAP.push(queryDocumentSnapshot.data());
          });
        })
        .catch(() => {
          // キャッシュの取得に失敗した場合にサーバから取得する
          myListsAPCollection
            .get({ source: "server" })
            .then((querySnapshot) => {
              querySnapshot.forEach((queryDocumentSnapshot) => {
                this.myListsAP.push(queryDocumentSnapshot.data());
              });
            })
            .catch(() => {
              alert("エラーが発生しました。");
            });
        });
    },

    /** 問題を取得する: FE */
    getQuestion() {

    },

    /** 問題を取得する: AP */
    getQuestionAP() {

    },

    /** エラーメッセージを表示する */
    showModalAlert(title, text) {
      this.modalAlertTitle = title;
      this.modalAlertText = text;
      this.isShowModalAlert = true; // メッセージ表示
      this.loadingEditProfile = false; // ローディング終わり
      this.disableEditProfile = false; // 編集可能
    },

    /** 名前を編集する */
    editName() {
      this.disableEditProfile = true; // 名前を編集不可、ボタン操作不可にする
      this.loadingEditProfile = true; // 編集ボタンをローディング状態にする

      // 名前をアップデートする
      this.db
        .doc(`users/${this.currentUser.uid}`)
        .update({
          name: this.inputEditName,
        })
        .then(() => {
          // 名前をローカルに保存する
          this.setUserName({ name: this.inputEditName });

          // 編集終わり
          this.isShowModalEditName = false;
          this.inputEditName = "";
          this.loadingEditProfile = false;
          this.disableEditProfile = false;
          this.snackbarText = "名前を変更しました";
          this.isShowSnackbar = true;
          setTimeout(() => {
            this.isShowSnackbar = false;
          }, 4750);
        })
        .catch((e) => {
          this.showModalAlert("エラーが発生しました。", "予期せぬエラーが発生しました。CODE:" + e.code);
        });
    },

    /** メールを編集する */
    editEmail() {
      this.disableEditProfile = true;
      this.loadingEditProfile = true;

      // メールとパスワードを使って再認証する
      const credential = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, this.inputPassword);
      this.auth.currentUser
        .reauthenticateWithCredential(credential)
        .then((userCredential) => {
          // 再認証完了
          // メールを変更する
          userCredential.user
            .updateEmail(this.inputEditEmail)
            .then(() => {
              // 変更完了

              // Firestoreの情報を変更する
              this.db
                .doc(`users/${this.currentUser.uid}`)
                .update({
                  email: this.inputEditEmail,
                })
                .then(() => {
                  // Firestore更新完了
                  // メールをローカルに保存する
                  this.setUserEmail({ email: this.inputEditEmail });

                  // IDトークン更新
                  this.auth.currentUser
                    .getIdToken(true)
                    .then(() => {
                      // 編集終わり
                      this.isShowModalEditEmail = false; // 編集画面を閉じる
                      this.inputEditEmail = "";
                      this.inputPassword = "";
                      this.isVisiblePassword = false;
                      this.disableEditProfile = false;
                      this.loadingEditProfile = false;
                      this.snackbarText = "メールを変更しました。";
                      this.isShowSnackbar = true;
                      setTimeout(() => {
                        this.isShowSnackbar = false;
                      }, 4750);
                    })
                    .catch((e) => {
                      this.showModalAlert("エラーが発生しました。", "予期せぬエラーが発生しました。CODE:" + String(e.code));
                    });
                })
                .catch((e) => {
                  this.showModalAlert("エラーが発生しました。", "予期せぬエラーが発生しました。CODE:" + String(e.code));
                });
            })
            .catch(() => {
              this.showModalAlert("エラーが発生しました。", "メールアドレスが既に使われているか無効な形式です。");
            });
        })
        .catch(() => {
          this.showModalAlert("エラーが発生しました。", "パスワードが間違っている可能性があります。");
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

    .userInfo-card {
      position: sticky;
      top: 20px;

      .userInfo-top {
        display: grid;
        grid-template:
          "area-avatar area-userName"
          / auto 1fr;

        .userInfo-top-avatar {
          grid-area: area-avatar;
        }

        .userInfo-top-userName {
          grid-area: area-userName;
          display: grid;
          grid-template:
            "name config"
            / 1fr auto;
          position: relative;
          border-radius: 2px;
          cursor: pointer;

          .userName {
            grid-area: name;
            font-size: 0.8rem;
            font-weight: 500;
            letter-spacing: 0.01rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .config {
            grid-area: config;
          }
        }
      }

      .userInfo-mail {
        font-size: 0.75rem;
        font-weight: 500;
        letter-spacing: 0.01rem;
      }

      .userInfo-mail-enableEdit {
        display: grid;
        grid-template:
          "mail config"
          / 1fr auto;
        position: relative;
        border-radius: 2px;
        cursor: pointer;

        .mail {
          grid-area: mail;
        }

        .config {
          grid-area: config;
        }
      }
    }
  }

  .userDetails {
    grid-area: detail;

    .userDetails-headline {
      font-size: 1.8rem;
      letter-spacing: 0.08rem;
      text-shadow: 1px 1px 1px #969696 rgba(150, 150, 150, 0.5);
    }

    .userDetails-alert {
      font-size: 0.9rem;
    }

    .opp_name {
      font-size: 0.75rem;
    }
  }
}
</style>
