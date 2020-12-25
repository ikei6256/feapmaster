<template>
  <div class="battle mt-2 mt-sm-4">
    <!-- 紙吹雪 -->
    <transition name="fade">
      <Confetti v-if="isShowConfetti"></Confetti>
    </transition>

    <!-- メッセージ -->
    <div id="message" class="area-message text-center py-1 py-sm-2">
      <span>{{ message }}</span>
    </div>

    <!-- プレイヤー表示エリア: 2人対戦 -->
    <div v-if="!MODE_4PLAYERS" class="area-players mt-2 mt-sm-4">
      <div class="player1">
        <player :playerData="myData" :isShowPlayerStatus="isShowPlayerStatus" :card_color="card_colors[0]" :MODE_4PLAYERS="MODE_4PLAYERS"></player>
      </div>

      <div class="player2">
        <transition name="fade" mode="out-in">
          <v-skeleton-loader v-if="isSearchingOpp1" type="image" :height="height_skeleton" elevation="2"></v-skeleton-loader>
          <player
            v-else
            :playerData="oppData1"
            :isShowPlayerStatus="isShowPlayerStatus"
            :card_color="card_colors[1]"
            :MODE_4PLAYERS="MODE_4PLAYERS"
          ></player>
        </transition>
      </div>
    </div>

    <!-- プレイヤー表示エリア: 4人対戦 -->
    <div v-else class="area-players4 mt-2 mt-sm-4">
      <div class="player1">
        <player :playerData="myData" :isShowPlayerStatus="isShowPlayerStatus" :card_color="card_colors[0]" :MODE_4PLAYERS="MODE_4PLAYERS"></player>
      </div>

      <div class="player2">
        <transition name="fade" mode="out-in">
          <v-skeleton-loader v-if="isSearchingOpp1" type="image" :height="height_skeleton" elevation="2"></v-skeleton-loader>
          <player
            v-else
            :playerData="oppData1"
            :isShowPlayerStatus="isShowPlayerStatus"
            :card_color="card_colors[1]"
            :MODE_4PLAYERS="MODE_4PLAYERS"
          ></player>
        </transition>
      </div>
      <div class="player3">
        <transition name="fade" mode="out-in">
          <v-skeleton-loader v-if="isSearchingOpp2" type="image" :height="height_skeleton" elevation="2"></v-skeleton-loader>
          <player
            v-else
            :playerData="oppData2"
            :isShowPlayerStatus="isShowPlayerStatus"
            :card_color="card_colors[2]"
            :MODE_4PLAYERS="MODE_4PLAYERS"
          ></player>
        </transition>
      </div>
      <div class="player4">
        <transition name="fade" mode="out-in">
          <v-skeleton-loader v-if="isSearchingOpp3" type="image" :height="height_skeleton" elevation="2"></v-skeleton-loader>
          <player
            v-else
            :playerData="oppData3"
            :isShowPlayerStatus="isShowPlayerStatus"
            :card_color="card_colors[3]"
            :MODE_4PLAYERS="MODE_4PLAYERS"
          ></player>
        </transition>
      </div>
    </div>

    <!-- 問題表示エリア -->
    <transition name="fade">
      <div v-if="isShowQuestionArea" class="my-2 my-sm-4">
        <div class="mt-2 mt-sm-4 px-1 px-sm-2">
          <Progressbar :timer_limit="timer_limit" :timer_valuenow="timer_valuenow"></Progressbar>
        </div>

        <Question
          class="my-2 my-sm-4"
          @selected="selected"
          @toggleShowJudge="isShowJudge = !isShowJudge"
          :isShowQuestion="isShowQuestion"
          :isShowJudge="isShowJudge"
          :myData="myData"
          :oppData1="oppData1"
          :oppData2="oppData2"
          :oppData3="oppData3"
          :questions="questions"
          :question_now="question_now"
          :winner="winner"
          :MODE_4PLAYERS="MODE_4PLAYERS"
          :rankings="rankings"
          :time_judgeModal="time_judgeModal"
        ></Question>
      </div>
    </transition>

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
      <div v-if="isShowReview" class="my-2 my-sm-4">
        <v-subheader>▼振り返り</v-subheader>
        <Review :questions="questions" :myAns="myAns"></Review>
      </div>
    </transition>

    <!-- 対戦中遷移注意モーダル -->
    <v-dialog v-model="isShowDialogQuitBattle" content-class="dialog_battle_cancel" transition="scroll-y-transition" hide-overlay>
      <v-card color="grey lighten-5">
        <v-card-title class="yellow lighten-2">
          <v-icon>{{ icons.mdiAlertCircleOutline }}</v-icon
          >注意
        </v-card-title>
        <v-card-text class="py-2">対戦を中止して画面を離れてもよろしいですか？</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="isShowDialogQuitBattle = false" color="indigo darken-3">キャンセル</v-btn>
          <v-btn text @click="nextLocation" color="red darken-1">対戦をやめる</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Player from "@/components/battle/Player.vue";
import { mapMutations, mapState } from "vuex";
import { mdiAlertCircleOutline } from "@mdi/js";
import firebase from "../firebase";
export default {
  components: {
    player: Player,
    Progressbar: () => import(/* webpackChunkName: "progressbar" */ "../components/battle/ProgressBar.vue"),
    Question: () => import(/* webpackChunkName: "question" */ "../components/battle/Question.vue"),
    Confetti: () => import(/* webpackChunkName: "confetti" */ "../components/battle/Confetti.vue"),
    Review: () => import(/* webpackChunkName: "review" */ "../components/battle/Review.vue"),
  },
  data() {
    return {
      icons: {
        mdiAlertCircleOutline,
      },
      SPEED_FADE: 350, // フェードイン/フェードアウトの入れ替え速度 350
      SPEED_FADE_SLOW: 700,
      NUM_QUESTION: 5, // 総問題数

      MODE_4PLAYERS: false, // 4人対戦ならtrue
      player_no: null, // プレイヤー番号: 1,2,3,4
      opp1_no: null,
      opp2_no: null,
      opp3_no: null,
      concurrent_sessions: 0, // 接続人数

      /** **部屋データ(DocumentReference)**
       * *isEnableJoin* 入室可能かどうか
       * *プレイヤー* player1 | player2 | player3 | player4
       * *プレイヤーデータ* name | photoURL | select | time
       * **例** player1_name
       * *questions[]* 問題の参照リスト配列
       */
      room: null,
      unsubscribe: null, // リアルタイムリスナーの破棄に使用する
      nextLocation: null, // 画面遷移メソッド

      /** **プレイヤーデータ**
       * 初期化は this.myData = {...this.DATA_PLAYER_INIT} のようにする
       * *name* 名前
       * *photoURL* 画像
       * *status* プレイヤーの状態 selecting | waiting | timeup | win | lose | draw | error | showRank
       * *score* 得点
       * *select* 回答
       * *time* 回答タイム
       * *add_score_tmp* 1問毎の得点
       * *rank_tmp* 1問毎の順位
       * *rank_final* 最終順位
       *********************/
      DATA_PLAYER_INIT: {
        name: null,
        photoURL: null,
        status: null,
        score: 0,
        select: null,
        time: null,
        add_score_tmp: 0,
        rank_tmp: null, // 1問毎の順位
        rank_final: null, // 順位の最終結果
      },
      myData: {},
      myAns: [], // 自分が回答したデータを保存する
      oppData1: {},
      oppData2: {},
      oppData3: {},

      card_colors: ["blue lighten-5", "red lighten-5", "purple lighten-5", "lime lighten-5"],
      height_skeleton: 0,

      /** 匿名用のランダムに表示する画像 */
      image_random: [
        "Bear",
        "Bee",
        "Bird",
        "Butterfly",
        "Chameleon",
        "Cocker-spaniel",
        "Cow",
        "Dolphin",
        "Dove",
        "Executive",
        "Flamingo",
        "Giraffe",
        "Gorilla",
        "Kangaroo",
        "Koala",
        "Paw",
        "Rabbit",
        "Sheep",
        "Shrimp",
        "Sloth",
        "Snail",
        "Squirrel",
        "Turtle",
      ],

      // 相手検索フラグ
      isSearchingOpp1: true,
      isSearchingOpp2: true,
      isSearchingOpp3: true,

      isJudging: false,  // 判定中フラグ

      TIMER_LIMIT_DEFAULT: 150, // 制限時間のデフォルト値 150
      timer_limit: 0, // 制限時間
      timer_valuenow: 0, // 経過時間
      timerId: null, // カウントダウンタイマーのIDを保存する
      timeoutId: null,

      // 結果表示モーダルのデータ
      time_judgeModal: null,
      intervalId_judgeModal: null,

      // 表示制御
      isShowQuestionArea: false, // 問題エリア
      isShowQuestion: false, // 問題
      isShowJudge: false, // 結果
      isShowPlayerStatus: false, // プレイヤーの状態
      isShowConfetti: false, // 紙吹雪
      isShowRestart: false, // 「もう一度」ボタン
      isShowReview: false, // 振り返り
      isShowDialogQuitBattle: false, // 対戦中止を決定するモーダル

      question_year: [2018, 2019],
      questionRefs: [], // 問題の参照配列
      questions: [], // 実際の問題データ
      question_now: 0, // 現在の問題数

      winner: null, // 0 引き分け | 1 自分 | 2 相手1 | 3 相手2 | 4 相手3

      /** **判定結果の順位データ**
       * ```json
       * // 例
       * [
       *   { rank:1 name: "あああ", select: 1, time: 150 },
       *   { rank:1 name: "いいい", select: 1, time: 150 },
       *   { rank:3 name: "ううう", select: 1, time: 300 },
       *   { rank:null name: "えええ", select: 2, time: 500 },
       * ]
       * ```
       ************/
      rankings: [],
      SCORES: [3, 2, 1, 0], // 4人対戦での得点 1位なら this.SCORES[0]

      message_num: 0,
      messages: ["待機中", "対戦を開始します！", "第1問", "第2問", "第3問", "第4問", "第5問", "終了!", "接続エラーが発生しました。"],
    };
  },
  computed: {
    ...mapState(["auth", "currentUser", "db", "isPlaying"]),
    message() {
      return this.messages[this.message_num];
    },
  },
  beforeMount() {
    this.myData = { ...this.DATA_PLAYER_INIT };

    // サインインユーザであるか確認してname、photoURLをセットする
    if (this.currentUser !== null) {
      this.myData.name = this.currentUser.name;
      this.myData.photoURL = this.currentUser.photoURL;
    } else {
      this.myData.name = "あなた";
      this.myData.photoURL = `/img/${this.image_random[Math.floor(Math.random() * this.image_random.length)]}.png`;
    }

    // 4人モードの判定を行う
    if (this.$router.currentRoute.name === "Battle4") {
      this.MODE_4PLAYERS = true;
    }
  },
  mounted() {
    // ブラウザを閉じるなどの場合の処理。後処理必須
    window.addEventListener("beforeunload", this.handlerLeave);

    // プレイヤー1の高さを取得してスケルトンローダーと高さを同じにする
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
    // this.handlerLeave();

    clearTimeout(this.timeoutId); // 現在進行中のtimeout処理を停止
    clearInterval(this.timerId); // タイマーを停止する
    this.stateBattleFalse();

    if (this.unsubscribe !== null) {
      this.unsubscribe(); // リアルタイムリスナーを破棄する
    }

    if (this.room !== null) {
      if (!this.MODE_4PLAYERS) {
        /***** 2人モード時の処理 *****/
        this.room.delete(); // 部屋を削除する
      } else {
        /***** 4人モード時の処理 *****/

        if (!this.isPlaying) {
          /*** 検索中の処理 ***/
          // 人数が1人なら部屋を削除する
          if (this.concurrent_sessions === 1) {
            this.room.delete();
          } else {
            leaveRoom(this.player_no, this.room);
          }
        } else {
          /*** 対戦中の処理 ***/
          // 人数が2人以下なら部屋を削除する
          if (this.concurrent_sessions <= 2) {
            this.room.delete();
          } else {
            leaveRoom(this.player_no, this.room);
          }
        }
      }
    }

    function leaveRoom(player_no, room) {
      switch (player_no) {
        case 1:
          room.update({
            player1_name: null,
            player1_photoURL: null,
          });
          break;
        case 2:
          room.update({
            player2_name: null,
            player2_photoURL: null,
          });
          break;
        case 3:
          room.update({
            player3_name: null,
            player3_photoURL: null,
          });
          break;
        case 4:
          room.update({
            player4_name: null,
            player4_photoURL: null,
          });
          break;
      }
    }
  },
  methods: {
    ...mapMutations(["stateBattleTrue", "stateBattleFalse", "incrementScore"]),

    /** **対戦に関わるデータを初期化する** */
    initData() {
      this.player_no = null;
      this.isSearchingOpp1 = true; // ステータス:検索中
      this.isJuding = false;
      this.oppData1 = { ...this.DATA_PLAYER_INIT };

      this.message_num = 0; // 「待機中...」
      this.question_now = 0;
      this.isShowPlayerStatus = false;
      this.isShowQuestion = false;
      this.isShowJudge = false;
      this.questionRefs = [];
      this.questions = [];
      this.myAns = [];
      this.myData.status = null;
      this.myData.score = 0;
      this.myData.select = null;
      this.myData.time = null;
      this.winner = null;
      this.room = null;

      // 4人対戦用のデータ
      if (this.MODE_4PLAYERS) {
        this.isSearchingOpp2 = true;
        this.isSearchingOpp3 = true;
        this.oppData2 = { ...this.DATA_PLAYER_INIT };
        this.oppData3 = { ...this.DATA_PLAYER_INIT };
        this.rankings = [];
      }
    },

    /** **対戦相手を検索する** */
    search() {
      this.initData(); // 対戦データを初期化する

      if (!this.MODE_4PLAYERS) {
        /*** 2人対戦 ***/

        this.db
          .collection("rooms")
          .where("isEnableJoin", "==", true)
          .limit(1) // 1件だけ
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              // 空き部屋が無い場合: 部屋を作成する
              this.createRoom();
            } else {
              // 空き部屋がある場合:入室処理
              let data;
              this.room = querySnapshot.docs[0].ref;

              // トランザクションスタート
              return this.db
                .runTransaction((transaction) => {
                  return transaction.get(this.room).then((snapshot) => {
                    data = snapshot.data();

                    if (!snapshot.exists || !data.isEnableJoin) {
                      throw Error();
                    }

                    transaction.update(this.room, {
                      isEnableJoin: false,
                      player2_name: this.myData.name,
                      player2_photoURL: this.myData.photoURL,
                    });
                  });
                })
                .then(() => {
                  this.player_no = 2;

                  // 問題の参照型をDocumentReferenceに変換してローカルに保存する
                  for (let ref of data.questions) {
                    this.questionRefs.push(this.db.doc(ref.path));
                  }

                  // 相手の情報をローカルに保存する
                  this.oppData1.name = data.player1_name !== "あなた" ? data.player1_name : "ゲストさん";
                  this.oppData1.photoURL = data.player1_photoURL !== null ? data.player1_photoURL : "/img/no-image.png";

                  this.createObserver(); // リアルタイムリスナー作成
                })
                .catch(() => {
                  this.search(); // 検索し直す
                });
            }
          });
      } else {
        /*** 4人対戦 ***/

        this.db
          .collection("rooms4")
          .where("isEnableJoin", "==", true)
          .limit(1) // 1件だけ
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              // 空き部屋が無い場合
              this.createRoom(); // 部屋を作成する
            } else {
              // 空き部屋がある場合入室処理(トランザクション)
              let data; // ドキュメントのデータ
              let emptySpace; // 部屋の空き人数
              this.room = querySnapshot.docs[0].ref;

              return this.db
                .runTransaction((transaction) => {
                  return transaction.get(this.room).then((snapshot) => {
                    data = snapshot.data();
                    if (!snapshot.exists || !data.isEnableJoin) {
                      throw Error();
                    }
                    // ここからは部屋の人数が3人以下の場合の処理

                    let obj = {}; // アップデートに使うオブジェクト

                    // 空き人数を調べる
                    emptySpace = [data.player1_name, data.player2_name, data.player3_name, data.player4_name].filter((i) => i === null).length;

                    // 空き人数が1人なら入室不可
                    if (emptySpace === 1) {
                      obj.isEnableJoin = false;
                    }

                    // 空いているプレイヤー番号を1から4の順に調べる
                    for (let i = 1; i <= 4; i++) {
                      if (data["player" + i + "_name"] === null) {
                        this.player_no = i;
                        break;
                      }
                    }

                    // アップデートするデータに名前と画像URLを追加
                    obj["player" + this.player_no + "_name"] = this.myData.name;
                    obj["player" + this.player_no + "_photoURL"] = this.myData.photoURL;

                    // トランザクション実行
                    transaction.update(this.room, obj);
                  });
                })
                .then(() => {
                  // 問題の参照型をDocumentReferenceに変換してローカルに保存する
                  for (let ref of data.questions) {
                    this.questionRefs.push(this.db.doc(ref.path));
                  }

                  this.createObserver(); // リアルタイムリスナー作成
                })
                .catch(() => {
                  this.search(); // 検索し直す
                });
            }
          });
      }
    },

    /** **部屋を作成する** */
    createRoom() {
      this.setQuestionRefs(); // 問題(Reference)をランダムに設定する

      if (!this.MODE_4PLAYERS) {
        /*** 2人対戦 ***/

        this.db
          .collection("rooms")
          .add({
            isEnableJoin: true,
            questions: this.questionRefs,

            player1_name: this.myData.name,
            player1_photoURL: this.myData.photoURL,
            player1_time: null,
            player1_ans: null,

            player2_name: null,
            player2_photoURL: null,
            player2_time: null,
            player2_ans: null,
          })
          .then((docRef) => {
            this.room = docRef;
            this.player_no = 1;
            this.createObserver(); // リアルタイムリスナー作成 ゲストが入室まで待機
          })
          .catch(() => {
            this.search(); // 検索しなおす
          });
      } else {
        /***  4人対戦 ***/

        this.db
          .collection("rooms4")
          .add({
            isEnableJoin: true,
            questions: this.questionRefs,

            player1_name: this.myData.name,
            player1_photoURL: this.myData.photoURL,
            player1_time: null,
            player1_ans: null,

            player2_name: null,
            player2_photoURL: null,
            player2_time: null,
            player2_ans: null,

            player3_name: null,
            player3_photoURL: null,
            player3_time: null,
            player3_ans: null,

            player4_name: null,
            player4_photoURL: null,
            player4_time: null,
            player4_ans: null,
          })
          .then((docRef) => {
            this.room = docRef;
            this.player_no = 1;
            this.createObserver(); // リアルタイムリスナー作成 ゲストが入室まで待機
          })
          .catch(() => {
            this.connectionError();
          });
      }
    },

    /** **問題(Reference)をランダムに設定する** */
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
        if (!this.questionRefs.some((q) => q.path === `/questions/${year}/${season}/${no}`)) {
          this.questionRefs.push(this.db.doc(`/questions/${year}/${season}/${no}`)); // 問題の参照を追加
        } else {
          continue; // 同じ問題がある場合はもう一度
        }
        i++;
      } while (i < this.NUM_QUESTION);
    },

    /** **部屋ドキュメントのリアルタイムリスナーを作成する** */
    createObserver() {
      this.unsubscribe = this.room.onSnapshot(
        (snapshot) => {
          // 部屋が削除された場合の処理
          if (!snapshot.exists) {
            this.unsubscribe(); // リアルタイムリスナーを破棄する
            this.unsubscribe = null;
            this.room = null;
            this.connectionError();
            return;
          }

          const data = snapshot.data(); // ドキュメントのデータ

          if (!this.MODE_4PLAYERS) {
            /***** 2人対戦時の処理 *****/

            // 検索中の処理
            if (this.isSearchingOpp1) {
              if (this.player_no === 2) {
                // プレイヤー2であれば検索を終了する
                this.isSearchingOpp1 = false; // 相手表示
                this.searched(); // 検索終了
                return;
              } else if (data.player2_name !== null) {
                // プレイヤー1で相手が見つかれば検索終了
                this.oppData1.name = data.player2_name !== "あなた" ? data.player2_name : "ゲストさん";
                this.oppData1.photoURL = data.player2_photoURL !== null ? data.player2_photoURL : "/img/no-image.png";
                this.isSearchingOpp1 = false; // 相手表示

                this.searched(); // 検索終了
                return;
              }
            }

            // 相手の回答をローカルに保存する
            if (
              (this.player_no === 1 ? data.player2_ans : data.player1_ans !== null) &&
              (this.player_no === 1 ? data.player2_ans : data.player1_ans !== this.oppData1.select)
            ) {
              this.oppData1.select = this.player_no === 1 ? data.player2_ans : data.player1_ans;
              this.oppData1.time = this.player_no === 1 ? data.player2_time : data.player1_time;
              this.oppData1.status = "waiting";
              this.judgeOrWait();
            }

            // 相手が時間切れの場合
            if ((this.player_no === 1 ? data.player2_time : data.player1_time) === "timeup") {
              // 相手が時間切れの場合
              this.oppData1.status = "timeup";
              this.judgeOrWait();
            }
          } else {
            /***** 4人対戦時の処理 *****/

            // 現在の人数を把握する
            this.concurrent_sessions = [data.player1_name, data.player2_name, data.player3_name, data.player4_name].filter((i) => i !== null).length;

            if (!this.isPlaying) {
              /*** 検索中の処理 ***/
              // 相手1が見つかった
              if (this.isSearchingOpp1) {
                if (data.player1_name !== null && this.player_no !== 1) {
                  this.oppData1.name = data.player1_name !== "あなた" ? data.player1_name : "ゲストさん";
                  this.oppData1.photoURL = data.player1_photoURL !== null ? data.player1_photoURL : "/img/no-image.png";
                  this.opp1_no = 1;
                  this.isSearchingOpp1 = false;
                } else if (data.player2_name !== null && this.player_no !== 2 && this.opp2_no !== 2) {
                  this.oppData1.name = data.player2_name !== "あなた" ? data.player2_name : "ゲストさん";
                  this.oppData1.photoURL = data.player2_photoURL !== null ? data.player2_photoURL : "/img/no-image.png";
                  this.opp1_no = 2;
                  this.isSearchingOpp1 = false;
                }
              }

              // 相手2が見つかった
              if (this.isSearchingOpp2) {
                if (data.player2_name !== null && this.player_no !== 2 && this.opp1_no !== 2) {
                  this.oppData2.name = data.player2_name !== "あなた" ? data.player2_name : "ゲストさん";
                  this.oppData2.photoURL = data.player2_photoURL !== null ? data.player2_photoURL : "/img/no-image.png";
                  this.opp2_no = 2;
                  this.isSearchingOpp2 = false;
                } else if (data.player3_name !== null && this.player_no !== 3 && this.opp3_no !== 3) {
                  this.oppData2.name = data.player3_name !== "あなた" ? data.player3_name : "ゲストさん";
                  this.oppData2.photoURL = data.player3_photoURL !== null ? data.player3_photoURL : "/img/no-image.png";
                  this.opp2_no = 3;
                  this.isSearchingOpp2 = false;
                }
              }

              // 相手3が見つかった
              if (this.isSearchingOpp3) {
                if (data.player3_name !== null && this.player_no !== 3 && this.opp2_no !== 3) {
                  this.oppData3.name = data.player3_name !== "あなた" ? data.player3_name : "ゲストさん";
                  this.oppData3.photoURL = data.player3_photoURL !== null ? data.player3_photoURL : "/img/no-image.png";
                  this.opp3_no = 3;
                  this.isSearchingOpp3 = false;
                } else if (data.player4_name !== null && this.player_no !== 4) {
                  this.oppData3.name = data.player4_name !== "あなた" ? data.player4_name : "ゲストさん";
                  this.oppData3.photoURL = data.player4_photoURL !== null ? data.player4_photoURL : "/img/no-image.png";
                  this.opp3_no = 4;
                  this.isSearchingOpp3 = false;
                }
              }

              /*** 検索中にプレイヤーが抜けた場合の処理 ***/
              // 相手1が抜けた
              if (
                !this.isSearchingOpp1 &&
                ((data.player1_name === null && this.opp1_no === 1) || (data.player2_name === null && this.opp1_no === 2))
              ) {
                this.isSearchingOpp1 = true;
                this.oppData1.name = null;
                this.oppData1.photoURL = null;
                this.opp1_no = null;
              }

              // 相手2が抜けた
              if (
                !this.isSearchingOpp2 &&
                ((data.player2_name === null && this.opp2_no === 2) || (data.player3_name === null && this.opp2_no === 3))
              ) {
                this.isSearchingOpp2 = true;
                this.oppData2.name = null;
                this.oppData2.photoURL = null;
                this.opp2_no = null;
              }

              // 相手3が抜けた
              if (
                !this.isSearchingOpp3 &&
                ((data.player3_name === null && this.opp3_no === 3) || (data.player4_name === null && this.opp3_no === 4))
              ) {
                this.isSearchingOpp3 = true;
                this.oppData3.name = null;
                this.oppData3.photoURL = null;
                this.opp3_no = null;
              }

              // 4人揃っていた場合検索終了
              if (this.concurrent_sessions === 4) {
                this.searched();
              }
            } else {
              /*** 対戦中の処理 ***/

              if (this.concurrent_sessions === 1) {
                this.connectionError();
                return;
              }

              /*** 対戦中に相手が抜けた時の処理 ***/
              // 相手1が抜けた
              if ((data.player1_name === null && this.opp1_no === 1) || (data.player2_name === null && this.opp1_no === 2)) {
                this.oppData1.status = "error";
                this.opp1_no = null;
              }

              // 相手2が抜けた
              if ((data.player2_name === null && this.opp2_no === 2) || (data.player3_name === null && this.opp2_no === 3)) {
                this.oppData2.status = "error";
                this.opp2_no = null;
              }

              // 相手3が抜けた
              if ((data.player3_name === null && this.opp3_no === 3) || (data.player4_name === null && this.opp3_no === 4)) {
                this.oppData3.status = "error";
                this.opp3_no = null;
              }

              /*** 相手が回答した時の処理 ***/
              // プレイヤー1が回答した
              if (data.player1_ans !== null && this.opp1_no === 1 && data.player1_ans !== this.oppData1.select) {
                this.oppData1.select = data.player1_ans;
                this.oppData1.time = data.player1_time;
                this.oppData1.status = "waiting";
                this.judgeOrWait();
              } else if (data.player2_ans !== null && this.opp1_no === 2 && data.player2_ans !== this.oppData1.select) {
                this.oppData1.select = data.player2_ans;
                this.oppData1.time = data.player2_time;
                this.oppData1.status = "waiting";
                this.judgeOrWait();
              }

              // 相手2が回答した
              if (data.player2_ans !== null && this.opp2_no === 2 && data.player2_ans !== this.oppData2.select) {
                this.oppData2.select = data.player2_ans;
                this.oppData2.time = data.player2_time;
                this.oppData2.status = "waiting";
                this.judgeOrWait();
              } else if (data.player3_ans !== null && this.opp2_no === 3 && data.player3_ans !== this.oppData2.select) {
                this.oppData2.select = data.player3_ans;
                this.oppData2.time = data.player3_time;
                this.oppData2.status = "waiting";
                this.judgeOrWait();
              }

              // 相手3が回答した
              if (data.player3_ans !== null && this.opp3_no === 3 && data.player3_ans !== this.oppData3.select) {
                this.oppData3.select = data.player3_ans;
                this.oppData3.time = data.player3_time;
                this.oppData3.status = "waiting";
                this.judgeOrWait();
              } else if (data.player4_ans !== null && this.opp3_no === 4 && data.player4_ans !== this.oppData3.select) {
                this.oppData3.select = data.player4_ans;
                this.oppData3.time = data.player4_time;
                this.oppData3.status = "waiting";
                this.judgeOrWait();
              }

              /*** 相手が時間切れ ***/
              // 相手1が時間切れ
              if (
                this.oppData1.status !== "timeup" &&
                ((data.player1_time === "timeup" && this.opp1_no === 1) || (data.player2_time === "timeup" && this.opp1_no === 2))
              ) {
                this.oppData1.status = "timeup";
                this.judgeOrWait();
              }

              // 相手2が時間切れ
              if (
                this.oppData2.status !== "timeup" &&
                ((data.player2_time === "timeup" && this.opp2_no === 2) || (data.player3_time === "timeup" && this.opp2_no === 3))
              ) {
                this.oppData2.status = "timeup";
                this.judgeOrWait();
              }

              // 相手3が時間切れ
              if (
                this.oppData3.status !== "timeup" &&
                ((data.player3_time === "timeup" && this.opp3_no === 3) || (data.player4_time === "timeup" && this.opp3_no === 4))
              ) {
                this.oppData3.status = "timeup";
                this.judgeOrWait();
              }
            }
          }
        }
      );
    },

    /** **接続エラー時の処理** */
    connectionError() {
      clearTimeout(this.timeoutId); // 何かしらの処理をストップ
      clearInterval(this.timerId); // タイマーストップ
      this.stateBattleFalse(); // 対戦フラグOFF
      this.message_num = this.messages.length - 1; // 「接続エラーが発生しました。」
      this.isShowQuestionArea = false; // 問題エリアを非表示

      if (!this.MODE_4PLAYERS) {
        this.oppData1.status = "error";
      }

      this.isShowPlayerStatus = true; // ステータスを表示 (接続エラー寺に非表示の可能性があるため)

      const message = document.getElementById("message").firstElementChild;

      if (message) {
        message.style.opacity = 1;
      }

      if (this.room !== null) {
        this.room
          .delete()
          .then(() => {
            this.room = null;
          })
          .catch(() => {
            this.room = null;
          });
      }

      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;
        this.isShowRestart = true; // 再戦ボタンを表示
      }, 1500);
    },

    /** **対戦相手が見つかった後の処理** */
    searched() {
      this.stateBattleTrue(); // ステータス:対戦中

      const message = document.getElementById("message").firstElementChild;

      // 問題の参照を用いて問題データを取得する
      for (const questionRef of this.questionRefs) {
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
            options: [data.ans1, data.ans2, data.ans3, data.ans4],
            correctAns: data.correctAns,
            questionImageUrl: data.questionImageUrl,
            answerAllImageUrl: data.answerAllImageUrl,
            answerImageUrls: [data.answerImageUrl1, data.answerImageUrl2, data.answerImageUrl3, data.answerImageUrl4],
          });
        });
      }

      // メッセージをフェードアウト
      message.animate(
        {
          opacity: [1, 0],
        },
        {
          duration: this.SPEED_FADE,
          fill: "forwards",
        }
      );

      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;
        this.startBattle(); // 対戦開始
      }, this.SPEED_FADE);
    },

    /** **対戦を開始する** **/
    startBattle() {
      const message = document.getElementById("message").firstElementChild;

      this.message_num++; // 「対戦を開始します」

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
              opacity: [0, 1],
            },
            {
              duration: this.SPEED_FADE,
              fill: "forwards",
            }
          );

          this.timeoutId = setTimeout(() => {
            this.timeoutId = null;
            this.resetPlayerStatus(); // プレイヤーの状態をリセットする
            this.nextQuestion(); // 出題開始
          }, 2000);
        }, 1500);
      }, 1500);
    }, // End: afterEnterShowOpp

    /** **次の問題へ進む** */
    nextQuestion() {
      if (this.question_now >= this.NUM_QUESTION) {
        this.endBattle(); // 全問題を終えていたら終了処理へ
        return;
      }

      const message = document.getElementById("message").firstElementChild;

      this.isJudging = false;
      this.isShowJudge = false; // 判定結果を非表示

      // 判定結果が消えるのを待つ
      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;
        this.isShowQuestion = false; // 問題を非表示
        this.question_now++;

        // メッセージをフェードアウト
        message.animate(
          {
            opacity: [1, 0],
          },
          {
            duration: this.SPEED_FADE,
            fill: "forwards",
          }
        );

        this.timeoutId = setTimeout(() => {
          this.timeoutId = null;

          this.message_num++; // 「第〇問」

          // メッセージをフェードイン
          message.animate(
            {
              opacity: [0, 1],
            },
            {
              duration: this.SPEED_FADE,
              fill: "forwards",
            }
          );

          this.timeoutId = setTimeout(() => {
            this.timeoutId = null;

            this.timer_limit = this.TIMER_LIMIT_DEFAULT; // 制限時間を設定する
            this.timer_valuenow = this.timer_limit;
            this.resetPlayerStatus(); // プレイヤーの状態をリセットする
            this.isShowPlayerStatus = true; // プレイヤーステータスを表示する
            this.isShowQuestion = true; // 問題を表示する
            this.startTimer(); // 回答タイマースタート
          }, this.SPEED_FADE + 1200);
        }, this.SPEED_FADE + 800);
      }, 500);
    },

    /** **プレイヤーの状態をリセットする** */
    resetPlayerStatus() {
      this.myData.status = "selecting";
      this.myData.select = null;

      if (!this.MODE_4PLAYERS) {
        /*** 2人対戦 ***/

        this.winner = null; // 勝敗結果をリセット
        this.oppData1.status = "selecting";
        this.oppData1.select = null;

        // プレイヤー1であればFirebase上のデータをリセット
        if (this.player_no === 1) {
          this.room
            .update({
              player1_ans: null,
              player1_time: null,
              player2_ans: null,
              player2_time: null,
            })
            .catch(() => {
              this.connectionError();
            });
        }
      } else {
        /*** 4人対戦 ***/

        this.rankings = []; // 判定結果をリセット

        // 相手1をリセット
        if (this.oppData1.status !== "error") {
          this.oppData1.status = "selecting";
          this.oppData1.select = null;
        }

        // 相手2をリセット
        if (this.oppData2.status !== "error") {
          this.oppData2.status = "selecting";
          this.oppData2.select = null;
        }

        // 相手3をリセット
        if (this.oppData3.status !== "error") {
          this.oppData3.status = "selecting";
          this.oppData3.select = null;
        }

        // Firebase上のデータをリセットする
        // 自身がプレイヤー1である
        // 自身がプレイヤー2かつプレイヤー1が接続エラー
        // 自身がプレイヤー3かつプレイヤー1と2が接続エラー
        if (
          this.player_no === 1 ||
          (this.oppData1.status === "error" && this.player_no === 2) ||
          (this.oppData1.status === "error" && this.oppData2.status === "error" && this.player_no === 3)
        ) {
          this.room
            .update({
              player1_ans: null,
              player1_time: null,
              player2_ans: null,
              player2_time: null,
              player3_ans: null,
              player3_time: null,
              player4_ans: null,
              player4_time: null,
            })
            .catch(() => {
              this.connectionError();
            });
        }
      }
    },

    /** **回答タイマー開始** */
    startTimer() {
      this.timerId = setInterval(() => {
        // カウントダウン
        this.timer_valuenow--;
        // 制限時間を超えた場合の処理
        if (this.timer_valuenow < 0) {
          clearInterval(this.timerId);
          this.timerId = null;

          // 自身の状態をtimeupにする
          if (this.myData.status === "selecting") {
            this.myAns.push(null); // 時間切れ
            this.myData.status = "timeup";

            // 状態を送信
            switch (this.player_no) {
              case 1:
                this.room
                  .update({
                    player1_time: "timeup",
                  })
                  .then(() => {
                    this.judgeOrWait();
                  })
                  .catch(() => {
                    this.connectionError();
                  });
                break;
              case 2:
                this.room
                  .update({
                    player2_time: "timeup",
                  })
                  .then(() => {
                    this.judgeOrWait();
                  })
                  .catch(() => {
                    this.connectionError();
                  });
                break;
              case 3:
                this.room
                  .update({
                    player3_time: "timeup",
                  })
                  .then(() => {
                    this.judgeOrWait();
                  })
                  .catch(() => {
                    this.connectionError();
                  });
                break;
              case 4:
                this.room
                  .update({
                    player4_time: "timeup",
                  })
                  .then(() => {
                    this.judgeOrWait();
                  })
                  .catch(() => {
                    this.connectionError();
                  });
                break;
            }
          }
        }
      }, 1000);
    },

    /** **勝敗判定に移るかのチェック** */
    judgeOrWait() {
      if (!this.MODE_4PLAYERS && !this.isJudging) {
        /*** 2人対戦 ***/

        // 両者の回答が揃った場合に勝敗判定を行う
        if (
          (this.myData.select !== null || this.myData.status === "timeup") &&
          (this.oppData1.select !== null || this.oppData1.status === "timeup")
        ) {
          clearInterval(this.timerId);
          this.judge();
        }
      } else {
        /*** 4人対戦 ***/

        // 4人の回答が揃った場合に勝敗判定を行う
        // 時間切れ、接続エラーの場合がある
        if (
          (this.myData.select !== null || this.myData.status === "timeup" || this.myData.status === "error") &&
          (this.oppData1.select !== null || this.oppData1.status === "timeup" || this.oppData1.status === "error") &&
          (this.oppData2.select !== null || this.oppData2.status === "timeup" || this.oppData2.status === "error") &&
          (this.oppData3.select !== null || this.oppData3.status === "timeup" || this.oppData3.status === "error")
        ) {
          clearInterval(this.timerId);
          this.judge();
        }
      }
    },

    /** **勝敗判定: 時間制限を過ぎた | 両者の回答が揃った**
     * ```
     * 自分の勝ち:
     *   自分が正解 && 相手が不正解か時間切れ
     *   自分が正解 && 相手が正解 && 相手より回答が早い
     * 相手の勝ち:
     *   相手が正解 && 自分が不正解か時間切れ
     *   相手が正解 && 自分が正解 && 相手の回答が早い
     * 引き分け:
     *   両者時間切れ
     *   自分が時間切れ && 相手が不正解
     *   相手が時間切れ && 自分が不正解
     *   両者不正解
     *   両者正解 && タイムが同じ
     * ```
     */
    judge() {
      if (this.isJudging) {
        return; // 既に判定中であれば何もしない
      } else {
        this.isJudging = true; // 判定中
      }

      // この段階で終了前の処理を行う
      if (this.question_now >= this.NUM_QUESTION) {
        this.stateBattleFalse();
        this.unsubscribe(); // リアルタイムリスナーを破棄
        this.unsubscribe = null;
      }

      // 少し待ってから処理を行う
      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;

        const correctAns = this.questions[this.question_now - 1].correctAns; // 正答番号

        // 勝敗判定を行う
        if (!this.MODE_4PLAYERS) {
          /*** 2人対戦 ***/

          const mySelect = this.myData.select; // 自分の回答
          const oppSelect = this.oppData1.select; // 相手の回答
          const myTime = this.myData.time; // 自分の回答タイム
          const oppTime = this.oppData1.time; // 相手の回答タイム

          if ((mySelect == correctAns && oppSelect != correctAns) || (mySelect == correctAns && oppSelect == correctAns && myTime < oppTime)) {
            this.winner = 1; // 自分の勝ち
          } else if ((oppSelect == correctAns && mySelect != correctAns) || (oppSelect == correctAns && mySelect == correctAns && oppTime < myTime)) {
            this.winner = 2; // 相手の勝ち
          } else {
            this.winner = 0; // 引き分け
          }

          this.isShowJudge = true; // 回答結果を表示する

          this.timeoutId = setTimeout(() => {
            this.timeoutId = null;

            // 得点に反映する
            if (this.winner === 1) {
              this.myData.score++;
            } else if (this.winner === 2) {
              this.oppData1.score++;
            }

            this.time_judgeModal = 5; // タイマー初期値
            this.intervalId_judgeModal = setInterval(() => {
              this.time_judgeModal--;

              if(this.time_judgeModal <= 0) {
                clearInterval(this.intervalId_judgeModal);
                this.intervalId_judgeModal = null;
                this.nextQuestion(); // 次の問題
              }
            }, 1000);
          }, 1500);
        } else {
          /*** 4人対戦 ***/

          /***** 順位付けを行う
           *************************/
          let players = [this.myData, this.oppData1, this.oppData2, this.oppData3];

          // 得点を仮保存するプロパティを初期化
          for (const player of players) {
            player.add_score_tmp = 0;
          }

          // 正解の人かつタイムの早い順
          let players_sorted = players.filter((p) => p.select === correctAns).sort((a, b) => a.time - b.time);

          /** 不正解の人を保存する配列 */
          let players_mistake = players.filter((p) => p.select !== correctAns);

          let now_rank = 1; // 順位
          let now_time = null; // 比較するタイム

          // 順位データに保存する
          players_sorted.forEach((player, index) => {
            if (now_time !== null) {
              if (player.time === now_time) {
                // タイムが同じ
                // 例{rank:1, name:"なまえ", select:1, time:55}
                this.rankings.push({ rank: now_rank, name: player.name, select: player.select, time: player.time });
                player.add_score_tmp = this.SCORES[now_rank - 1]; // 得点を仮保存
                player.rank_tmp = now_rank; // 1問毎の順位
              } else {
                // タイムが異なる: 下位に追加
                now_time = player.time;
                now_rank = index + 1; // 現在の人数が順位となる
                this.rankings.push({ rank: now_rank, name: player.name, select: player.select, time: player.time });
                player.add_score_tmp = this.SCORES[now_rank - 1];
                player.rank_tmp = now_rank;
              }
            } else {
              // 最初のデータを追加する
              now_time = player.time;
              this.rankings.push({ rank: 1, name: player.name, select: player.select, time: player.time });
              player.add_score_tmp = 3;
              player.rank_tmp = 1;
            }
          });

          // 順位のデータに不正解の人を追加
          players_mistake.forEach((player) => {
            this.rankings.push({ rank: null, name: player.name, select: player.select, time: player.time });
            player.add_score_tmp = 0;
            player.rank_tmp = null;
          });
          /***** 順位付けここまで
           ********************************/

          this.isShowJudge = true; // 回答結果を表示する

          this.timeoutId = setTimeout(() => {
            this.timeoutId = null;

            // 得点に反映する
            for (const player of players) {
              player.score += player.add_score_tmp;
            }

            this.time_judgeModal = 5; // タイマー初期値
            this.intervalId_judgeModal = setInterval(() => {
              this.time_judgeModal--;

              if(this.time_judgeModal <= 0) {
                clearInterval(this.intervalId_judgeModal);
                this.intervalId_judgeModal = null;
                this.nextQuestion(); // 次の問題
              }
            }, 1000);
          }, 1500);
        }
      }, 1000);
    },

    /** **全問題が終了後** */
    endBattle() {
      const players = [this.myData, this.oppData1, this.oppData2, this.oppData3];

      // リアルタイムリスナーを破棄する
      if (this.unsubscribe !== null) {
        this.unsubscribe();
        this.unsubscribe = null;
      }

      // 4人対戦での順位決めを行う
      if (this.MODE_4PLAYERS) {
        // スコアの高い順に並べる
        let players_sorted = players.sort((a, b) => b.score - a.score);

        // 順位を確定する
        let now_rank = 1; // プレイヤーデータに追加する順位
        let now_score = null; // 比較するタイム
        players_sorted.forEach((player, index) => {
          if (now_score !== null) {
            if (player.score === now_score) {
              // スコアが同じ: 同じ順位にする
              player.rank_final = now_rank;
            } else {
              // スコアが異なる: 下位の順位にする
              now_rank = index + 1;
              player.rank_final = now_rank;
            }
          } else {
            // 最初のデータを追加する
            now_score = player.score;
            player.rank_final = 1;
          }
        });
      }

      // サインインユーザは問題と回答データを保存する
      if (this.currentUser !== null) {
        const docUser = this.db.doc(`users/${this.currentUser.uid}`);

        if (!this.MODE_4PLAYERS) {
          /*** 2人対戦 ***/
          const record = {
            questions: this.questions,
            myAnswers: this.myAns,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            opp_name: this.oppData1.name,
            opp_photoURL: this.oppData1.photoURL,
          };

          if (this.myData.score > this.oppData1.score) {
            record.result = "win";
            docUser.update({
              battle_win: firebase.firestore.FieldValue.increment(1),
            });
            this.incrementScore({ prop: "battle_win" });
          } else if (this.myData.score < this.oppData1.score) {
            record.result = "lose";
            docUser.update({
              battle_lose: firebase.firestore.FieldValue.increment(1),
            });
            this.incrementScore({ prop: "battle_lose" });
          } else {
            record.result = "draw";
            docUser.update({
              battle_draw: firebase.firestore.FieldValue.increment(1),
            });
            this.incrementScore({ prop: "battle_draw" });
          }

          this.db.collection(`users/${this.currentUser.uid}/battleRecords`).add(record);
        } else {
          /*** 4人対戦 ***/
          const record = {
            questions: this.questions,
            myAnswers: this.myAns,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            opp1_name: this.oppData1.name,
            opp1_photoURL: this.oppData1.photoURL,
            opp2_name: this.oppData2.name,
            opp2_photoURL: this.oppData2.photoURL,
            opp3_name: this.oppData3.name,
            opp3_photoURL: this.oppData3.photoURL,
            rank: this.myData.rank_final,
          };

          // ユーザの順位を記録する
          switch (this.myData.rank_final) {
            case 1:
              docUser.update({
                battle4_1: firebase.firestore.FieldValue.increment(1),
              });
              this.incrementScore({ prop: "battle4_1" });
              break;
            case 2:
              docUser.update({
                battle4_2: firebase.firestore.FieldValue.increment(1),
              });
              this.incrementScore({ prop: "battle4_2" });
              break;
            case 3:
              docUser.update({
                battle4_3: firebase.firestore.FieldValue.increment(1),
              });
              this.incrementScore({ prop: "battle4_3" });
              break;
            case 4:
              docUser.update({
                battle4_4: firebase.firestore.FieldValue.increment(1),
              });
              this.incrementScore({ prop: "battle4_4" });
              break;
          }

          this.db.collection(`users/${this.currentUser.uid}/battleRecords4`).add(record);
        }
      }

      const message = document.getElementById("message").firstElementChild;

      // メッセージをフェードアウト
      message.animate(
        {
          opacity: [1, 0],
        },
        {
          duration: this.SPEED_FADE,
          fill: "forwards",
        }
      );

      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;

        this.message_num++; // 「終了!」

        // メッセージをフェードイン
        message.animate(
          {
            opacity: [0, 1],
          },
          {
            duration: this.SPEED_FADE,
            fill: "forwards",
          }
        );

        this.timeoutId = setTimeout(() => {
          this.timeoutId = null;

          this.isShowQuestionArea = false; // 設問エリア非表示

          // 最終結果発表
          if (!this.MODE_4PLAYERS) {
            /*** 2人対戦 ***/

            // プレイヤー1は部屋削除
            if (this.player_no === 1 && this.room !== null) {
              this.room
                .get()
                .then((snapshot) => {
                  if (snapshot.exists) {
                    this.room.delete();
                    this.room = null;
                  }
                })
                .catch(() => {
                  this.room = null;
                });
            }

            if (this.myData.score > this.oppData1.score) {
              this.myData.status = "win";
              this.oppData1.status = "lose";

              // 少しの間紙吹雪を出現させる
              this.isShowConfetti = true;
              setTimeout(() => {
                this.isShowConfetti = false; // 紙吹雪非表示
              }, 12000);
            } else if (this.myData.score < this.oppData1.score) {
              this.myData.status = "lose";
              this.oppData1.status = "win";
            } else {
              this.myData.status = "draw";
              this.oppData1.status = "draw";
            }
          } else {
            /*** 4人対戦 ***/

            /*** 部屋を削除する ***
             * 自身がプレイヤー1
             * 自身がプレイヤー2かつプレイヤー1が接続エラー
             * 自身がプレイヤー3かつプレイヤー1と2が接続エラー
             ***********************/
            if (
              this.player_no === 1 ||
              (this.oppData1.status === "error" && this.player_no === 2) ||
              (this.oppData1.status === "error" && this.oppData2.status === "error" && this.player_no === 3)
            ) {
              this.room.delete();
            }

            // 順位を表示して1位の場合は少しの間紙吹雪を出現させる
            for (const player of players) {
              player.status = "showRank";

              if (player.rank_final === 1) {
                this.isShowConfetti = true; // 紙吹雪表示
                setTimeout(() => {
                  this.isShowConfetti = false; // 紙吹雪非表示
                }, 12000);
              }
            }
          }

          this.timeoutId = setTimeout(() => {
            this.timeoutId = null;

            this.isShowRestart = true; // 再戦ボタン出現
            this.isShowReview = true; // 振り返り出現
          }, 2000);
        }, this.SPEED_FADE + 1000);
      }, this.SPEED_FADE);
    },

    /** **もう一度対戦を行う** */
    restart() {
      this.isShowConfetti = false; // 花吹雪を消す
      this.isShowReview = false; // 「振り返り」のエリアを消す
      this.isShowRestart = false; // 「もう一度」のエリアを消す

      this.search(); // 検索開始
    },

    /** **Question.vue - 回答時の処理** */
    selected(ans) {
      const ansTime = this.timer_limit - this.timer_valuenow;

      // 自分の回答をローカルに保存する
      this.myData.select = ans;
      this.myAns.push(ans);
      this.myData.time = ansTime;
      this.myData.status = "waiting";

      // 自分の回答をFirebaseに反映する
      switch (this.player_no) {
        case 1:
          this.room
            .update({
              player1_ans: ans,
              player1_time: ansTime,
            })
            .then(() => {
              this.judgeOrWait();
            })
            .catch(() => {
              this.connectionError();
            });
          break;
        case 2:
          this.room
            .update({
              player2_ans: ans,
              player2_time: ansTime,
            })
            .then(() => {
              this.judgeOrWait();
            })
            .catch(() => {
              this.connectionError();
            });
          break;
        case 3:
          this.room
            .update({
              player3_ans: ans,
              player3_time: ansTime,
            })
            .then(() => {
              this.judgeOrWait();
            })
            .catch(() => {
              this.connectionError();
            });
          break;
        case 4:
          this.room
            .update({
              player4_ans: ans,
              player4_time: ansTime,
            })
            .then(() => {
              this.judgeOrWait();
            })
            .catch(() => {
              this.connectionError();
            });
          break;
      }
    },

    /** **画面を遷移する際の処理** */
    handlerLeave(e) {
      e.preventDefault();
      this.room.delete();
      return "よろしいですか？";
    },
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
