<template>
  <div class="battle mt-2 mt-sm-4">
    <!-- 紙吹雪 -->
    <transition name="fade-200">
      <confetti v-if="isShowConfetti"></confetti>
    </transition>

    <!-- メッセージ -->
    <div id="message" class="area-message text-center py-1 py-sm-2">
      <span>{{ message }}</span>
    </div>

    <!-- ここから: プレイヤー表示エリア -->
    <div v-if="!MODE_4PLAYERS" class="area-players mt-2 mt-sm-4">
      <div class="player1">
        <player :playerData="myData" :isShowPlayerStatus="isShowPlayerStatus"></player>
      </div>

      <div class="player2">
        <transition name="fade" mode="out-in">
          <v-skeleton-loader v-if="isSearchingOpp1" type="image" :height="height_skeleton" elevation="2"></v-skeleton-loader>
          <player v-else :playerData="oppData1" :isShowPlayerStatus="isShowPlayerStatus"></player>
        </transition>
      </div>
    </div>

    <!-- 4人モード -->
    <div v-else class="area-players4 mt-2 mt-sm-4">
      <div class="player1">
        <player :playerData="myData" :isShowPlayerStatus="isShowPlayerStatus"></player>
      </div>

      <div class="player2">
        <transition name="fade" mode="out-in">
          <v-skeleton-loader v-if="isSearchingOpp1" type="image" :height="height_skeleton" elevation="2"></v-skeleton-loader>
          <player v-else :playerData="oppData1" :isShowPlayerStatus="isShowPlayerStatus"></player>
        </transition>
      </div>
      <div class="player3">
        <transition name="fade" mode="out-in">
          <v-skeleton-loader v-if="isSearchingOpp2" type="image" :height="height_skeleton" elevation="2"></v-skeleton-loader>
          <player v-else :playerData="oppData2" :isShowPlayerStatus="isShowPlayerStatus"></player>
        </transition>
      </div>
      <div class="player4">
        <transition name="fade" mode="out-in">
          <v-skeleton-loader v-if="isSearchingOpp3" type="image" :height="height_skeleton" elevation="2"></v-skeleton-loader>
          <player v-else :playerData="oppData3" :isShowPlayerStatus="isShowPlayerStatus"></player>
        </transition>
      </div>
    </div>
    <!-- ここまで: プレイヤー表示エリア -->

    <!-- ここから: 問題表示エリア -->
    <transition name="fade-slow">
      <div v-if="isShowQuestionArea" class="my-2 my-sm-4">
        <!-- プログレスバー -->
        <div class="mt-2 mt-sm-4 px-1 px-sm-2">
          <progressbar :timer_limit="timer_limit" :timer_valuenow="timer_valuenow"></progressbar>
        </div>

        <question
          class="my-2 my-sm-4"
          @selected="selected"
          @toggleShowJudge="isShowJudge = !isShowJudge"
          :isShowQuestion="isShowQuestion"
          :isShowJudge="isShowJudge"
          :myData="myData"
          :oppData1="oppData1"
          :question="questions[question_now - 1]"
          :winner="winner"
        ></question>
      </div>
    </transition>
    <!-- ここまで: 問題表示 -->

    <!-- 再戦ボタン  -->
    <transition name="fade">
      <div v-show="isShowRestart" class="text-center my-3 my-sm-6">
        <v-btn class="white--text" @click="restart" color="teal darken-1 mx-2">もう一度</v-btn>
        <router-link :to="{ name: 'Home' }">
          <v-btn color="grey lighten-5 mx-2">ホームへ戻る</v-btn>
        </router-link>
      </div>
    </transition>

    <!-- 振り返り -->
    <transition name="fade">
      <div v-show="isShowReview" class="my-2 my-sm-4">
        <v-subheader>▼振り返り</v-subheader>
        <review :questions="questions" :myAns="myAns"></review>
      </div>
    </transition>

    <!-- ここから: Modal -->
    <v-dialog v-model="isShowDialogQuitBattle" content-class="dialog_battle_cancel" transition="scroll-y-transition" hide-overlay>
      <v-card color="grey lighten-5">
        <v-card-title class="dialog_battle_cancel_title"
          ><v-icon>{{ icons.mdiAlertCircleOutline }}</v-icon
          >注意</v-card-title
        >
        <v-card-text class="py-2">対戦を中止して画面を離れてもよろしいですか？</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="isShowDialogQuitBattle = false" color="indigo darken-3">キャンセル</v-btn>
          <v-btn text @click="nextLocation" color="red darken-1">対戦をやめる</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ここまで: Modal-->
  </div>
</template>

<script>
import Player from "@/components/battle/Player.vue";
import { mapMutations, mapState } from "vuex";
import { mdiAlertCircleOutline } from "@mdi/js";
import $ from "jquery";
export default {
  components: {
    player: Player,
    progressbar: () => import(/* webpackChunkName: "progressbar" */ "../components/battle/ProgressBar.vue"),
    question: () => import(/* webpackChunkName: "question" */ "../components/battle/Question.vue"),
    confetti: () => import(/* webpackChunkName: "confetti" */ "../components/battle/Confetti.vue"),
    review: () => import(/* webpackChunkName: "review" */ "../components/battle/Review.vue"),
  },
  data() {
    return {
      /**********************
       * 共通データ 2人対戦 / 4人対戦
       **********************/
      icons: {
        mdiAlertCircleOutline,
      },

      MODE_4PLAYERS: false, // true: 4人対戦

      SPEED_FADE: 350, // フェードイン/フェードアウトの入れ替え速度 350
      SPEED_FADE_SLOW: 700,
      NUM_QUESTION: 5, // 総問題数

      height_skeleton: 0,

      // TIMER_LIMIT_DEFAULT: 150, // 制限時間のデフォルト値
      TIMER_LIMIT_DEFAULT: 3, // 制限時間のデフォルト値
      timer_limit: 0, // 制限時間
      timer_valuenow: 0, // 経過時間
      timerId: null, // カウントダウンタイマーのIDを保存する
      timeoutId: null,
      blinkIntervalId: null, // 「選択中」を点滅させるためのInterval ID

      room: null, // 部屋のDocumentReference
      unsubscribe: null, // リアルタイムリスナーの破棄に使用する
      nextLocation: null, // 画面遷移メソッド

      myData: {
        cardColor: "blue lighten-5",
        name: null,
        photoURL: null,
        status: null, // selecting | waiting | timeup | win | lose | draw | error
        score: 0, // 得点
        select: null, // 回答番号
        time: null, // 回答タイム(秒)
      },
      oppData1: {
        cardColor: "red lighten-5",
        name: null,
        photoURL: null,
        status: null,
        score: 0,
        select: null,
        time: null,
      },

      // 匿名用のランダムに表示する画像と名前
      image_random:["Bear","Bee","Bird","Butterfly","Chameleon","Cocker-spaniel","Cow", "Dolphin","Dove","Executive","Flamingo","Giraffe","Gorilla","Kangaroo","Koala","Paw","Rabbit","Sheep","Shrimp","Sloth","Snail","Squirrel","Turtle"],

      isHost: null, // 部屋のホストかゲストか
      isSearchingOpp1: true, // 対戦相手検索中

      isShowQuestionArea: false, // 問題表示エリアを表示するタイミングを制御する
      isShowQuestion: false, // 問題を表示するタイミングを制御する
      isShowJudge: false, // 結果を表示するタイミングを制御する
      isShowPlayerStatus: false, // プレイヤーの状態を表示するタイミングを制御する
      isShowConfetti: false, // 紙吹雪を表示するタイミングを制御する
      isShowRestart: false, // 「もう一度」ボタンを表示するタイミングを制御する
      isShowReview: false, // 振り返りを表示するタイミングを制御する
      isShowDialogQuitBattle: false, // 対戦中止を決定するモーダルの表示フラグ

      question_year: [2018, 2019],
      questionRefs: [], // 問題の参照
      questions: [], // 実際の問題データ
      question_now: 0, // 現在の問題数

      myAns: [], // 自分が回答したデータを保存する
      winner: null, // 0 引き分け | 1 自分 | 2 相手1 | 3 相手2 | 4 相手3
      message_num: 0,
      messages:["待機中","対戦を開始します！","第1問","第2問","第3問","第4問","第5問","終了!","接続エラーが発生しました。"],

      /*********************
       * 4人対戦用データ
       *********************/
      guest_no: 0, // 1,2,3
      isSearchingOpp2: true,
      isSearchingOpp3: true,
      oppData2: {
        cardColor: "purple lighten-5",
        name: null,
        photoURL: null,
        status: null,
        score: 0,
        select: null,
        time: null,
      },
      oppData3: {
        cardColor: "lime lighten-5",
        name: null,
        photoURL: null,
        status: null,
        score: 0,
        select: null,
        time: null,
      },
    };
  },
  computed: {
    ...mapState(["auth", "currentUser", "db", "isPlaying"]),
    message() {
      return this.messages[this.message_num];
    },
  },
  watch: {
    /*** ここから: 回答が選択されたときの処理 ***/
    "myData.select": function (val) {
      if (val !== null) {
        this.myAns.push(val);
        this.myData.status = "waiting";
        this.judgeOrWait(); // 勝敗判定に移るかチェック
      }
    },
    "oppData1.select": function (val) {
      if (val !== null) {
        this.oppData1.status = "waiting";
        this.judgeOrWait();
      }
    },
    "oppData2.select": function (val) {
      if (val !== null) {
        this.oppData2.status = "waiting";
        this.judgeOrWait();
      }
    },
    "oppData3.select": function (val) {
      if (val !== null) {
        this.oppData3.status = "waiting";
        this.judgeOrWait();
      }
    },
    /*** ここまで: 回答が選択されたときの処理 ***/

    /*** ここから: ステータス変更時の処理 ***/
    "myData.status": function (val) {
      // 時間切れの場合の処理
      if (val == "timeup" && (this.oppData1.select != null || this.oppData1.status == "timeup")) {
        this.judge(); // 相手が回答済みか時間切れの場合判定処理へ
      }
    },
    "oppData1.status": function (val) {
      if (val == "timeup" && (this.myData.select != null || this.myData.status == "timeup")) {
        this.judge(); // 自分が回答済みか時間切れの場合判定処理へ
      }
    },
    /*** ここまで: 時間切れの場合の処理 ***/
  },
  beforeMount() {
    // サインインユーザであるか確認してname、photoURLをセットする
    if (this.currentUser == null) {
      this.myData.name = "あなた";
      this.myData.photoURL = `/img/${this.image_random[Math.floor(Math.random() * this.image_random.length)]}.png`;
    } else {
      this.myData.name = this.currentUser.name;
      this.myData.photoURL = this.currentUser.photoURL;
    }

    // 4人モードの判定を行う
    if (this.$router.currentRoute.name === "Battle4") {
      this.MODE_4PLAYERS = true;
    }
  },
  mounted() {
    // ブラウザを閉じるなどの場合の処理
    window.addEventListener("beforeunload", this.handlerLeave);

    // プレイヤー1の高さを取得してローダーの高さと同じにする
    this.height_skeleton = document.getElementsByClassName("player1")[0].clientHeight;

    this.search(); // 対戦相手を検索する
  },
  beforeRouteLeave(to, from, next) {
    // 対戦画面から離れる時対戦中なら確認メッセージを表示する
    if (this.isPlaying) {
      this.nextLocation = next; // 遷移メソッドを保存
      this.isShowDialogQuitBattle = true; // モーダルを表示する
    } else {
      next();
    }
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.handlerLeave);
    clearTimeout(this.timeoutId); // 現在進行中のtimeout処理を停止
    clearInterval(this.timerId); // タイマーを停止する
    clearInterval(this.blinkIntervalId); // 「選択中」の点滅を停止

    if (this.isPlaying) {
      this.stateBattleFalse();
    }

    this.handlerLeave();
  },
  methods: {
    ...mapMutations(["stateBattleTrue", "stateBattleFalse"]),

    /*** 対戦に関わるデータを初期化する ***/
    initBattleData() {
      this.message_num = 0; // 「待機中...」
      this.question_now = 0;
      this.isSearchingOpp1 = true; // ステータス:検索中
      this.isShowPlayerStatus = false;
      this.isShowQuestion = false;
      this.isShowJudge = false;
      this.questionRefs = [];
      this.questions = [];
      this.myAns = [];
      this.oppData1.name = null;
      this.oppData1.photoURL = null;
      this.myData.score = 0;
      this.oppData1.score = 0;
      this.myData.status = null;
      this.oppData1.status = null;
      this.myData.select = null;
      this.oppData1.select = null;
      this.winner = null;
      this.room = null;

      // 4人対戦用のデータ
      if (this.MODE_4PLAYERS) {
        this.guest_no = 0;
        this.isSearchingOpp2 = true;
        this.isSearchingOpp3 = true;
        this.oppData2.name = null;
        this.oppData3.name = null;
        this.oppData2.photoURL = null;
        this.oppData3.photoURL = null;
        this.oppData2.score = 0;
        this.oppData3.score = 0;
        this.oppData2.status = null;
        this.oppData3.status = null;
        this.oppData2.select = null;
        this.oppData3.select = null;
      }
    },

    /*** 対戦相手を検索する ***/
    search() {
      this.initBattleData(); // 対戦データを初期化する

      if (!this.MODE_4PLAYERS) {
        /*** 2人対戦の処理 ***/

        this.db
          .collection("rooms")
          .where("guest1.name", "==", null)
          .limit(1) // 1件だけ
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              // 空き部屋が無い場合
              this.isHost = true; // ホストで参加
              this.createRoom(); // 部屋を作成する
            } else {
              // 空き部屋がある場合
              this.isHost = false; // ゲストで参加
              this.room = querySnapshot.docs[0].ref;

              // 自身のデータをドキュメントに保存する(席の確保)
              this.room.update({
                guest1: {
                  name: this.myData.name,
                  photoURL: this.myData.photoURL,
                },
              });

              const data = querySnapshot.docs[0].data();

              // 問題の参照型をDocumentReferenceに変換して保存する
              for (let ref of data.questions) {
                this.questionRefs.push(this.db.doc(ref.path));
              }

              // 相手の情報をローカルに保存する
              this.oppData1.name = data.host.name !== "あなた" ? data.host.name : "ゲストさん";
              this.oppData1.photoURL = data.host.photoURL !== null ? data.host.photoURL : "/img/no-image.png";

              this.createObserver(); // リアルタイムリスナー作成
            }
          });
      } else {
        /*** 4人対戦 ***/

        this.db
          .collection("rooms4")
          .where("isPlaying", "==", false)
          .limit(1) // 1件だけ
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              // 空き部屋が無い場合
              this.isHost = true; // ホストで参加
              this.createRoom(); // 部屋を作成する
            } else {
              // 空き部屋がある場合
              this.isHost = false; // ゲストで参加
              this.room = querySnapshot.docs[0].ref;

              const data = querySnapshot.docs[0].data();

              // 問題の参照型をDocumentReferenceに変換して保存する
              for (let ref of data.questions) {
                this.questionRefs.push(this.db.doc(ref.path));
              }

              // 空席が一つの場合は部屋の状態を対戦中にする
              if ([data.host.name, data.guest1.name, data.guest2.name, data.guest3.name].filter(i => i === null).length === 1) {
                this.room.update({
                  isPlaying: true,
                });
              }

              // 席の確保を行う
              if (data.guest1.name === null) {
                // ゲスト1の席を確保
                this.room.update({
                  guest1: {
                    name: this.myData.name,
                    photoURL: this.myData.photoURL,
                    ans: null,
                    time: null
                  }
                }).then(() => {
                  this.guest_no = 1;
                  this.createObserver(); // リアルタイムリスナー作成
                });
              } else if (data.guest2.name === null) {
                // ゲスト2の席を確保
                this.room.update({
                  guest2: {
                    name: this.myData.name,
                    photoURL: this.myData.photoURL,
                    ans: null,
                    time: null
                  }
                }).then(() => {
                  this.guest_no = 2;
                  this.createObserver();
                });
              } else if (data.guest3.name === null) {
                // ゲスト3の席を確保
                this.room.update({
                  guest3: {
                    name: this.myData.name,
                    photoURL: this.myData.photoURL,
                    ans: null,
                    time: null
                  }
                }).then(() => {
                  this.guest_no = 3;
                  this.createObserver();
                });
              } else if (data.host.name === null) {
                // ホストの席を確保
                this.room.update({
                  host: {
                    name: this.myData.name,
                    photoURL: this.myData.photoURL,
                    ans: null,
                    time: null
                  }
                }).then(() => {
                  this.isHost = true;
                  this.createObserver();
                })
              } else {
                this.search(); // 検索しなおす
              }
            }
          });
      }
    },

    /*** 部屋を作成する ***/
    createRoom() {
      this.setQuestionRefs(); // 問題(Reference)をランダムに設定する

      if (!this.MODE_4PLAYERS) {
        // 2人対戦
        this.db
          .collection("rooms")
          .add({
            host: {
              name: this.myData.name,
              photoURL: this.myData.photoURL,
              time: null,
              ans: null,
            },
            guest1: {
              name: null,
              photoURL: null,
              time: null,
              ans: null,
            },
            questions: this.questionRefs,
          })
          .then((docRef) => {
            this.room = docRef;
            this.createObserver(); // リアルタイムリスナー作成 ゲストが入室まで待機
          });
      } else {
        // 4人対戦
        this.db
          .collection("rooms4")
          .add({
            host: {
              name: this.myData.name,
              photoURL: this.myData.photoURL,
              time: null,
              ans: null,
            },
            guest1: {
              name: null,
              photoURL: null,
              time: null,
              ans: null,
            },
            guest2: {
              name: null,
              photoURL: null,
              time: null,
              ans: null,
            },
            guest3: {
              name: null,
              photoURL: null,
              time: null,
              ans: null,
            },
            questions: this.questionRefs,
            isPlaying: false,
          })
          .then((docRef) => {
            this.room = docRef;
            this.createObserver(); // リアルタイムリスナー作成 ゲストが入室まで待機
          });
      }
    },

    /*** 問題(Reference)をランダムに設定する ***/
    setQuestionRefs() {
      let i = 0;
      do {
        const year = this.question_year[Math.floor(Math.random() * this.question_year.length)];
        const season = Math.floor(Math.random() * 2) === 0 ? "spring" : "autumn";
        let no = Math.floor(Math.random() * 80) + 1; // 問題番号 1~80
        if (no < 10) {
          no = "0" + no; // 0パディング
        }
        // 問題被りチェック
        if (!this.questionRefs.some((q) => q.path === `questions/${year}/${season}/${no}`)) {
          this.questionRefs.push(this.db.doc(`questions/${year}/${season}/${no}`)); // 問題追加
        } else {
          continue; // 同じ問題がある場合はもう一度
        }
        i++;
      } while (i < this.NUM_QUESTION);
    },

    /*** 部屋ドキュメントのリアルタイムリスナーを作成する ***/
    createObserver() {
      this.unsubscribe = this.room.onSnapshot((snapshot) => {
        /***** 共通処理 *****/

        // 接続エラー時の処理
        if (!snapshot.exists) {
          this.unsubscribe(); // リアルタイムリスナーを破棄する
          this.connectionError();
          return;
        }

        const data = snapshot.data(); // ドキュメントのデータ

        if (!this.MODE_4PLAYERS) {
          /***** 2人対戦時の処理 *****/

          if (this.isSearchingOpp1) {
            // 検索中の処理

            if (!this.isHost) {
              // ゲストであれば検索を終了する
              this.searched(); // 検索終了
              return;
            } else if (data.guest1.name !== null) {
              // ホストかつ相手が見つかった場合、相手のデータをローカルに保存する
              this.oppData1.name = data.guest1.name !== "あなた" ? data.guest1.name : "ゲストさん";
              this.oppData1.photoURL = data.guest1.photoURL !== null ? data.guest1.photoURL : "/img/no-image.png";
              // this.isSearchingOpp1 = false;
              this.searched(); // 検索終了
              return;
            }
          }

          // 相手の回答をローカルに反映する
          if (this.isHost ? data.guest1.ans : data.host.ans != null && this.isHost ? data.guest1.ans : data.host.ans != this.oppData1.select) {
            this.oppData1.select = this.isHost ? data.guest1.ans : data.host.ans;
            this.oppData1.time = this.isHost ? data.guest1.time : data.host.time;
          } else if (this.isHost ? data.guest1.time : data.host.time == "timeup") {
            // 相手が時間切れの場合
            this.oppData1.status = "timeup";
          }
          // 自分の回答をローカルに反映する
          if (this.isHost ? data.host.ans : data.guest1.ans != null && this.isHost ? data.host.ans : data.guest1.ans != this.myData.select) {
            this.myData.select = this.isHost ? data.host.ans : data.guest1.ans;
            this.myData.time = this.isHost ? data.host.time : data.guest1.time;
          }
        } else {
          /***** 4人対戦時の処理 *****/

          if (!this.isPlaying) {
            // 検索中

            // 4人揃ったら対戦開始
            if (data.isPlaying) {
              this.searched(); // 対戦開始
            }
          } else {
            // 対戦中

          }
        }
      }, () => {
        // エラー時の処理
        this.connectionError();
      });
    },

    /*** リアルタイムリスナーのエラー処理 ***/
    connectionError() {
      clearTimeout(this.timeoutId); // 何かしらの処理をストップ
      clearInterval(this.timerId); // タイマーストップ
      clearInterval(this.blinkIntervalId);
      this.stateBattleFalse(); // ステータスを戻す
      this.message_num = this.messages.length - 1; // 「接続エラーが発生しました。」
      this.oppData1.status = "error";
      this.isShowPlayerStatus = true;
      this.isShowQuestionArea = false; // 問題エリアを非表示

      document.getElementById("message").firstElementChild.style.opacity = 1;

      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;
        this.isShowRestart = true; // 再戦ボタンを表示
      }, 1500);
    },

    /*** 対戦相手が見つかった後の処理 ***/
    searched() {
      this.stateBattleTrue(); // ステータス:対戦中
      this.isSearchingOpp1 = false; // 検索を終えて対戦相手を表示する

      // 問題の参照を用いて問題データを取得する
      for (let questionRef of this.questionRefs) {
        // questionRef は DocumentReference
        questionRef.get().then((querySnapshot) => {
          let data = querySnapshot.data();

          // 数値へ変換する
          if (typeof data.correctAns === "string") {
            data.correctAns = parseInt(data.correctAns);
          }

          this.questions.push({
            year: questionRef.parent.parent.id,
            season: questionRef.parent.id,
            no: questionRef.id, // 問番号
            body: data.text, // 問題文
            options: { ア: data.ans1, イ: data.ans2, ウ: data.ans3, エ: data.ans4 },
            correctAns: data.correctAns,
            questionImageUrl: data.questionImageUrl,
            answerAllImageUrl: data.answerAllImageUrl,
            answerImageUrls: [data.answerImageUrl1, data.answerImageUrl2, data.answerImageUrl3, data.answerImageUrl4],
          });

          // 問題の取得が終わったら処理を進める
          if (this.questions.length === this.NUM_QUESTION) {
            // メッセージをフェードアウト(animateでopacityを変更して高さを確保)
            $("#message span").animate(
              {
                opacity: 0,
              },
              this.SPEED_FADE,
              () => {
                this.startBattle(); // 対戦開始
              }
            );
          }
        });
      }
    },

    /*** 対戦を開始する ***/
    startBattle() {
      const message = $("#message span");
      this.message_num++; // 「対戦を開始します」

      // 「選択中」の点滅を開始する
      this.blinkIntervalId = setInterval(() => {
        // 「選択中」を点滅させる
        $(".blink").fadeOut(450).fadeIn(450);
      }, 2000);

      // 少し待ってから実行
      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;
        this.isShowQuestionArea = true; // 問題エリアを表示する

        // 少し待ってから実行
        this.timeoutId = setTimeout(() => {
          this.timeoutId = null;
          // メッセージ「対戦を開始します」をフェードイン
          message.animate(
            {
              opacity: 1,
            },
            this.SPEED_FADE,
            () => {
              // 少し待ってから実行
              this.timeoutId = setTimeout(() => {
                this.timeoutId = null;
                this.resetPlayerStatus(); // プレイヤーの状態をリセットする
                this.nextQuestion(); // 出題開始
              }, 2000);
            }
          );
        }, 1500);
      }, 1500);
    }, // End: afterEnterShowOpp

    /*** 次の問題へ進む ***/
    nextQuestion() {
      if (this.question_now < this.NUM_QUESTION) {
        this.question_now++; // 次の問題へ
      } else {
        this.unsubscribe(); // リアルタイムリスナーを破棄
        this.endBattle(); // 全問題を終えていたら終了処理へ
        return;
      }

      const message = $("#message span");

      this.isShowJudge = false; // 判定結果を非表示
      this.isShowQuestion = false; // 問題を非表示
      this.winner = null; // 勝敗結果をリセット

      // メッセージを切り替える
      message.animate(
        {
          opacity: 0,
        },
        this.SPEED_FADE,
        () => {
          // フェードアウトしたあとにメッセージを切り替えておく
          this.message_num++; // 「第〇問」
          // 少し待ってから処理
          this.timeoutId = setTimeout(() => {
            this.timeoutId = null;
            message.animate(
              {
                opacity: 1,
              },
              this.SPEED_FADE,
              () => {
                // 「第〇問」をフェードインした後の処理
                // 少し待ってから次の問題へ進む
                this.timeoutId = setTimeout(() => {
                  this.timeoutId = null;
                  this.timer_limit = this.TIMER_LIMIT_DEFAULT; // 制限時間を設定する
                  this.timer_valuenow = this.timer_limit;
                  this.resetPlayerStatus(); // プレイヤーの状態をリセットする
                  this.isShowPlayerStatus = true; // プレイヤーステータスを表示する
                  this.isShowQuestion = true; // 問題を表示する
                  this.startTimer(); // 回答タイマースタート
                }, 1200);
              }
            );
          }, 800);
        }
      );
    },

    /*** プレイヤーの状態をリセットする ***/
    resetPlayerStatus() {
      this.myData.status = "selecting";
      this.oppData1.status = "selecting";
      this.myData.select = null;
      this.oppData1.select = null;

      // ホストであればFirebase上のデータをリセット
      if (this.isHost) {
        this.room.update({
          host: {
            ans: null,
            time: null,
          },
          guest1: {
            ans: null,
            time: null,
          },
        });
      }
    },

    /*** 回答タイマー開始 ***/
    startTimer() {
      this.timerId = setInterval(() => {
        // カウントダウン
        this.timer_valuenow--;
        // 制限時間を超えた場合の処理
        if (this.timer_valuenow < 0) {
          clearInterval(this.timerId);
          this.timerId = null;
          // 状態:timeup にするかを判定する
          if (this.myData.status == "selecting") {
            this.myData.status = "timeup";
            this.myAns.push(null); // 時間切れ
            // Firebaseへ反映する
            if (this.isHost) {
              this.room.update({
                host: {
                  time: "timeup",
                },
              });
            } else {
              this.room.update({
                guest1: {
                  time: "timeup",
                },
              });
            }
          }
        }
      }, 1000);
    },

    /*** 勝敗判定に移るかのチェック ***/
    judgeOrWait () {
      if (!this.MODE_4PLAYERS) {
        // 2人モードの場合
        // 両者の回答が揃った場合に勝敗判定を行う
        if (this.myData.select !== null && this.oppData1.select !== null) {
          clearInterval(this.timerId);
          this.judge();
          return; // 以降の処理を行わない
        }
      } else {
        // 4人モードの場合
        // 4人の回答が揃った場合に勝敗判定を行う
        if (this.myData.select !== null && this.oppData1.select !== null && this.oppData2.select !== null && this.oppData3.select !== null) {
          clearInterval(this.timerId);
          this.judge();
        }
      }
    },

    /*** 勝敗判定: 時間制限を過ぎた | 両者の回答が揃った ***
     * 自分の勝ち:
     *   自分が正解 & 相手が不正解か時間切れ
     *   自分が正解 & 相手が正解 & 相手より回答が早い
     * 相手の勝ち:
     *   相手が正解 & 自分が不正解か時間切れ
     *   相手が正解 & 自分が正解 & 相手の回答が早い
     * 引き分け:
     *   両者時間切れ
     *   自分が時間切れ & 相手が不正解
     *   相手が時間切れ & 自分が不正解
     *   両者不正解
     *   両者正解 & タイムが同じ
     */
    judge() {
      // 少し待ってから処理を行う
      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;

        // 判定を行う
        const mySelect = this.myData.select; // 自分の回答
        const oppSelect = this.oppData1.select; // 相手の回答
        const myTime = this.myData.time; // 自分の回答タイム
        const oppTime = this.oppData1.time; // 相手の回答タイム
        const correctAns = this.questions[this.question_now - 1].correctAns; // 正答
        if ((mySelect == correctAns && oppSelect != correctAns) || (mySelect == correctAns && oppSelect == correctAns && myTime < oppTime)) {
          this.winner = 1; // 自分の勝ち
        } else if ((oppSelect == correctAns && mySelect != correctAns) || (oppSelect == correctAns && mySelect == correctAns && oppTime < myTime)) {
          this.winner = 2; // 相手の勝ち
        } else {
          this.winner = 0; // 引き分け
        }

        this.isShowJudge = true; // 回答結果を表示する

        // 少し待ってから処理を行う
        this.timeoutId = setTimeout(() => {
          this.timeoutId = null;

          // 得点に反映する
          if (this.winner === 1) {
            this.myData.score++;
          } else if (this.winner === 2) {
            this.oppData1.score++;
          }

          // 少し待ってから次の問題へ
          this.timeoutId = setTimeout(() => {
            this.timeoutId = null;
            this.nextQuestion();
          }, 4000);
        }, 1500);
      }, 1000);
    },

    /*** 全問題が終了後 ***/
    endBattle() {
      const message = $("#message span");
      this.stateBattleFalse(); // ステータス: 対戦終了
      clearInterval(this.blinkIntervalId);

      // メッセージをフェードアウトする
      message.fadeOut(this.SPEED_FADE, () => {
        // フェードアウト後の処理
        this.message_num++; // 「終了！」
        message.fadeIn(this.SPEED_FADE, () => {
          // 「終了！」フェードイン後の処理
          // 少し待ってから実行する
          this.timeoutId = setTimeout(() => {
            this.timeoutId = null;
            this.isShowQuestionArea = false; // 問題非表示
            if (this.isHost) this.room.delete(); // 部屋削除

            // 勝敗結果を反映する
            if (this.myData.score > this.oppData1.score) {
              this.myData.status = "win";
              this.oppData1.status = "lose";

              // 少しの間紙吹雪を出現させる
              this.isShowConfetti = true;
              this.timeoutId = setTimeout(() => {
                this.timeoutId = null;
                this.isShowConfetti = false; // 紙吹雪非表示
              }, 12000);
            } else if (this.myData.score < this.oppData1.score) {
              this.myData.status = "lose";
              this.oppData1.status = "win";
            } else {
              this.myData.status = "draw";
              this.oppData1.status = "draw";
            }

            this.timeoutId = setTimeout(() => {
              this.timeoutId = null;

              this.isShowRestart = true; // 再戦ボタン出現
              this.isShowReview = true; // 振り返り出現
            }, 2000);
          }, 1000);
        });
      });
    },

    /*** もう一度対戦を行う ***/
    restart() {
      this.isShowConfetti = false; // 花吹雪を消す
      this.isShowReview = false; // 「振り返り」のエリアを消す
      this.isShowRestart = false; // 「もう一度」のエリアを消す

      this.search(); // 検索開始
    },

    /*** QuestionComponent - 回答時の処理 ***/
    selected(ans) {
      // 自分の回答をFirebaseに反映する
      if (this.isHost) {
        this.room.update({
          host: {
            ans: ans,
            time: this.timer_limit - this.timer_valuenow,
          },
        });
      } else {
        this.room.update({
          guest1: {
            ans: ans,
            time: this.timer_limit - this.timer_valuenow,
          },
        });
      }
    },

    /*** 画面を遷移する際の処理 ***/
    handlerLeave() {
      if (this.room !== null) {
        if (this.unsubscribe !== null) {
          this.unsubscribe(); // リアルタイムリスナーを破棄する
        }
        if (!this.MODE_4PLAYERS) {
          this.room.delete(); // 2人モード時は部屋を削除
        }
      }
    }
  }, // End: methods
};
</script>

<style lang="scss">
// 対戦中に画面を離れる時の注意メッセージモーダル
.v-dialog {
  &.dialog_battle_cancel {
    position: absolute;
    top: 0; // 画面上部に配置する
    max-width: 98%;

    @media screen and (min-width: 600px) {
      width: 588px;
    }

    .dialog_battle_cancel_title {
      background-color: #fded3f;
    }
  }
}
</style>

<style lang="scss" scoped>
$battle-blue: #113bad;

/* -------------------- *
 * メッセージ表示エリア
 * -------------------- */
.area-message {
  background-color: #fff;
  border-right: solid 0.5rem $battle-blue;
  border-left: solid 0.5rem $battle-blue;
  border-radius: 0.5rem;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

  span {
    display: inline-block;
    min-height: 0.8rem;
    font-size: 1.1rem;
    color: $battle-blue;
    font-weight: bold;
  }
}

/* -------------------- *
 * プレイヤー表示エリア
 * -------------------- */
.area-players {
  display: grid;
  grid-template:
    "... player1 ... player2 ..."
    / minmax(0.2rem, auto) 1fr minmax(0.2rem, auto) 1fr minmax(0.2rem, auto);

  @media screen and (min-width: 600px) {
    grid-template:
      "... player1 ... player2 ..."
      / minmax(0.2rem, auto) minmax(auto, 250px) minmax(0.2rem, auto) minmax(auto, 250px) minmax(0.2rem, auto);
  }

  .player1 {
    grid-area: player1;
  }
  .player2 {
    grid-area: player2;
  }
}

// 4人モード
.area-players4 {
  display: grid;
  grid-template:
    "... player1 ... player2 ... player3 ... player4 ..."
    / minmax(0.1rem, auto) minmax(auto, 250px)
    minmax(0.1rem, auto) minmax(auto, 250px)
    minmax(0.1rem, auto) minmax(auto, 250px)
    minmax(0.1rem, auto) minmax(auto, 250px) minmax(0.1rem, auto);

  .player1 {
    grid-area: player1;
  }
  .player2 {
    grid-area: player2;
  }
  .player3 {
    grid-area: player3;
  }
  .player4 {
    grid-area: player4;
  }
}
</style>
