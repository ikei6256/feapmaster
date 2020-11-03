<template>
  <div class="container-fluid container-sm">
    <transition name="fade">
      <confetti :isShowConfetti="isShowConfetti"></confetti>
    </transition>

    <!-- Start: メッセージ -->
    <div id="message" class="messageArea">
      <span>{{ message }}</span>
    </div>
    <!-- End: メッセージ -->

    <!-- Start: プレイヤー表示エリア -->
    <div class="row mb-3">
      <div class="col pl-1 pr-1 overflow-hidden player1">
        <div class="float-left text-center w-100">
          <player
            :playerData="myData"
            :isShowPlayerStatus="isShowPlayerStatus"
          ></player>
        </div>
        <div id="player1-flush" class="flush-area"></div>
        <!-- 得点時フラッシュ -->
      </div>
      <div
        id="player1-score"
        class="col-1 p-0 text-center d-flex align-items-center"
      >
        <span class="score">{{ myData.score }}</span>
        <!-- 自分の得点 -->
      </div>
      <div class="col-auto p-0 d-flex align-items-center font-weight-bold">
        :
      </div>
      <div
        id="player2-score"
        class="col-1 p-0 text-center d-flex align-items-center"
      >
        <span class="score">{{ oppData.score }}</span>
        <!-- 相手の得点 -->
      </div>
      <div class="col pl-1 pr-1 position-relative overflow-hidden player2">
        <div class="float-left text-center w-100">
          <transition name="fade-slow" mode="out-in">
            <div v-if="isSearching" class="loading position-absolute">
              <div class="spinner-grow text-info" role="status"></div>
              <span class="text-info">相手を探しています...</span>
            </div>
            <player
              v-else
              :playerData="oppData"
              :isShowPlayerStatus="isShowPlayerStatus"
              @blink="blink"
            ></player>
          </transition>
        </div>
        <div id="player2-flush" class="flush-area"></div>
        <!-- 得点時フラッシュ -->
      </div>
    </div>
    <!-- End: プレイヤー画像表示エリア -->

    <!-- Start:問題表示 -->
    <transition name="fade-slow">
      <question
        @selected="selected"
        v-if="isShowQuestionArea"
        :myData="myData"
        :oppData="oppData"
        :question_now="question_now"
        :question="questions[question_now - 1]"
        :isShowQuestion="isShowQuestion"
        :isShowJudge="isShowJudge"
        :time_limit="time_limit"
        :winner="winner"
      ></question>
    </transition>
    <!-- End:問題表示 -->

    <!-- Start: 対戦終了後の表示エリア  -->
    <transition name="fade">
      <div v-show="isShowRestart">
        <div class="text-center mb-3">
          <button @click="restart" class="btn btn-primary">もう一度</button>
          <router-link :to="{ name: 'Home' }">
            <button class="btn btn-secondary">ホームへ戻る</button>
          </router-link>
        </div>

        <div>
          <p class="mb-1 ml-1 review">▼振り返り</p>
          <review :questions="questions" :myAns="myAns"></review>
        </div>
      </div>
    </transition>
    <!-- End: 対戦終了後の表示エリア -->

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">注意!</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            対戦中です！<br />対戦画面から離れてもよろしいですか？
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              キャンセル
            </button>
            <button type="button" class="btn btn-primary" id="next">OK</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Player from "@/components/battle/Player.vue";
import { mapState } from "vuex";
import $ from 'jquery';
export default {
  components: {
    player: Player,
    question: () => import(/* webpackChunkName: "question" */ '../components/battle/Question.vue'),
    confetti: () => import(/* webpackChunkName: "confetti" */ '../components/battle/Confetti.vue'),
    review: () => import(/* webpackChunkName: "review" */ '../components/battle/Review.vue'),
  },
  data() {
    return {
      SPEED_FADE: 350, // フェードイン/フェードアウトの入れ替え速度 350
      SPEED_FADE_SLOW: 700,
      NUM_QUESTION: 5, // 総問題数
      room: null, // 部屋のDocumentReference
      unsubscribe: null, // リアルタイムリスナーの破棄に使用する
      myData: {
        name: null,
        photoUrl: null,
        status: null, // selecting | waiting | timeup | win | lose | draw
        score: 0, // 得点
        select: null, // 回答番号
        time: null, // 回答タイム(秒)
      },
      oppData: {
        name: null,
        photoUrl: null,
        status: null,
        score: 0,
        select: null,
        time: null,
      },
      time_limit: null, // 時間制限の最大値を保存
      timerId: null, // カウントダウンタイマーのIDを保存する
      blinkIntervalId: null, // 「選択中」を点滅させるためのInterval ID

      isHost: null, // 部屋のホストかゲストか
      isPlaying: false, // 対戦中かどうか
      isSearching: true, // 対戦相手検索中
      isShowQuestionArea: false, // 問題表示エリアを表示するタイミングを制御する
      isShowQuestion: false, // 問題を表示するタイミングを制御する
      isShowPlayerStatus: false, // プレイヤーの状態を表示するタイミングを制御する
      isShowJudge: false, // 結果を表示するタイミングを制御する
      isShowConfetti: false, // 紙吹雪を表示するタイミングを制御する
      isShowRestart: false, // 「もう一度」ボタンを表示するタイミングを制御する

      question_now: 0, // 現在の問題数
      questionRefs: [], // 問題の参照
      questions: [], // 実際の問題データ
      myAns: [], // 自分が回答したデータを保存する
      winner: null, // 勝敗 --- 0 引き分け | 1 自分 | 2 相手
      message_num: 0,
      messages: ["待機中...", "対戦を開始します！", "第1問", "第2問", "第3問", "第4問", "第5問", "終了!"],
    };
  },
  computed: {
    message() {
      return this.messages[this.message_num];
    },
    ...mapState(["auth", "db"]),
  },
  watch: {
    /*** 回答が選択されたときの処理 ***/
    "myData.select": function (val) {
      if (val != null) {
        this.myAns.push(val);
        this.myData.status = "waiting";
      }
      // 両者が回答していればタイマーを止めて勝敗判定を行う
      if (val != null && this.oppData.select != null) {
        clearInterval(this.timerId); // タイマーを止める
        this.judge();
      }
    },
    "oppData.select": function (val) {
      if (val != null) {
        this.oppData.status = "waiting";
      }
      if (val != null && this.myData.select != null) {
        clearInterval(this.timerId);
        this.judge();
      }
    },
    /* 時間切れの場合 */
    "myData.status": function (val) {
      if (val == "timeup" && (this.oppData.select != null || this.oppData.status == "timeup")) {
        this.judge(); // 相手が回答済みか時間切れの場合判定処理へ
      }
    },
    "oppData.status": function (val) {
      if (val == "timeup" && (this.myData.select != null || this.myData.status == "timeup")) {
        this.judge(); // 自分が回答済みか時間切れの場合判定処理へ
      }
    },
  },
  beforeMount() {
    // console.log("--- BattleComponent: beforeMount ---");

    // サインインユーザであるか確認してname、photoUrlをセットする
    if (this.auth.currentUser == null) {
      this.myData.name = "げすとさん";
      this.myData.photoUrl = "/img/Bear.png";
    } else {
      this.myData.name = this.auth.currentUser.displayName;
      this.myData.photoUrl = this.auth.currentUser.photoUrl;
    }
  },
  mounted() {
    // console.log("--- Battle: mounted ---");
    this.search(); // 対戦相手を検索する
  },
  beforeRouteLeave(to, from, next) {
    // console.log("--- BattleComponent: beforeRouteLeave ---");

    // 対戦画面から離れる時対戦中なら確認メッセージを表示する
    if (this.isPlaying) {
      $("#exampleModal").modal("show"); // モーダルを表示する
      this.execModal(next);
    } else {
      this.routeLeave(next);
    }
  },
  beforeDestroy() {
    // 自分がホストかつ部屋が存在する場合部屋を削除

  },
  methods: {
    /*** 対戦相手を検索する ***/
    search() {
      // console.log("Methods: search");
      this.message_num = 0; // 「待機中...」
      this.question_now = 0;
      this.isSearching = true;
      this.isShowPlayerStatus = false;
      this.isShowQuestion = false;
      this.isShowJudge = false;
      this.questionRefs = [];
      this.questions = [];
      this.myAns = [];
      this.oppData.name = null;
      this.oppData.photoUrl = null;
      this.myData.score = 0;
      this.oppData.score = 0;
      this.myData.status = null;
      this.oppData.status = null;
      this.myData.select = null;
      this.oppData.select = null;
      this.winner = null;

      this.db
        .collection("rooms")
        .where("guest_name", "==", null)
        .limit(1) // 1件だけ
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            // 空き部屋が無い場合の処理
            // console.log("空室無し");
            this.isHost = true; // ホストで参加
            this.createRoom(); // 部屋を作成する
          } else {
            // 空き部屋がある場合の処理
            // console.log("空室有り");
            this.isHost = false; // ゲストで参加
            this.room = querySnapshot.docs[0].ref;
            this.room.update({
              guest_name: this.myData.name,
              // guest_photoUrl: this.myData.photoUrl,
              guest_photoUrl: null,
            });
            this.createObserver(this.room); // リアルタイムリスナー作成
            this.oppData.name = querySnapshot.docs[0].get("host_name");
            this.oppData.photoUrl = querySnapshot.docs[0].get("host_photoUrl");
            if (this.oppData.photoUrl == null) this.oppData.photoUrl = "/img/Squirrel.png";
            this.questionRefs = querySnapshot.docs[0].get("questions"); // 問題の参照を保存

            // 少し待ってから実行
            setTimeout(() => {
              this.searched();
            }, 1000);
          }
        });
    },

    /*** ホストの場合部屋を作成する ***/
    createRoom() {
      this.setQuestionRefs(); // 問題(Reference)をランダムに設定する
      this.db
        .collection("rooms")
        .add({
          // status: false, // 対戦中かどうか
          // host_uid: null, // サインインユーザでない場合はnull
          // guest_uid: null,
          host_name: this.myData.name, // ホスト名
          guest_name: null, // ゲスト名
          host_photoUrl: null, // サインインユーザでない場合はnull
          guest_photoUrl: null,
          host_time: null, // ホスト回答タイム
          guest_time: null, // ゲスト回答タイム
          host_ans: null, // ホスト回答
          guest_ans: null, // ゲスト回答
          // host_score: 0, // ホスト得点
          // guest_score: 0, // ゲスト得点
          // host_prepare: false, // ホスト準備完了
          // guest_prepare: false, // ゲスト準備完了
          // 問題 2020年秋の問題1～5を仮に置いておく
          questions: this.questionRefs, // ランダムな問題の参照リスト
        })
        .then((documentReference) => {
          this.room = documentReference;
          this.createObserver(this.room); // リアルタイムリスナー作成 ゲストが入室まで待機
        });
    },

    /*** 問題(Reference)をランダムに設定する ***/
    setQuestionRefs() {
      let i = 0;
      do {
        const year = 2020;
        // const season = Math.floor(Math.random() * 2) == 0 ? "spring" : "autumn";
        // const season = "autumn";
        const season = "spring";
        let no = Math.floor(Math.random() * 80) + 1;
        if (no < 10) {
          no = "0" + no; // 0パディング
        }
        if(!this.questionRefs.some(q => q.path === `questions/${year}/${season}/${no}`)){
          this.questionRefs.push(this.db.doc(`questions/${year}/${season}/${no}`)); // 問題追加
        } else {
          continue;
        }
        i++;
      } while (i < this.NUM_QUESTION);
    },

    /*** 部屋ドキュメントのリアルタイムリスナーを作成する ***/
    createObserver(room) {
      // console.log("Methods: createObserver");
      this.unsubscribe = room.onSnapshot((snapshot) => {
        const data = snapshot.data();

        // 自身がホストの場合、相手の名前を更新する
        if (this.isSearching && this.isHost && data.guest_name != null) {
          // console.log("対戦相手が入室しました");
          this.oppData.name = data.guest_name;
          this.oppData.photoUrl = data.guest_photoUrl != null ? data.guest_photoUrl : "/img/Squirrel.png";
          this.isSearching = false;
          // 少し待ってから実行
          setTimeout(() => {
            this.searched();
          }, 1000);
        }

        // 相手の回答をローカルに反映する
        if (
          this.isHost
            ? data.guest_ans
            : data.host_ans != null && this.isHost
            ? data.guest_ans
            : data.host_ans != this.oppData.select
        ) {
          this.oppData.select = this.isHost ? data.guest_ans : data.host_ans;
          this.oppData.time = this.isHost ? data.guest_time : data.host_time;
        } else if (this.isHost ? data.guest_time : data.host_time == "timeup") {
          // 相手が時間切れの場合
          this.oppData.status = "timeup";
        }
        // 自分の回答をローカルに反映する
        if (
          this.isHost
            ? data.host_ans
            : data.guest_ans != null && this.isHost
            ? data.host_ans
            : data.guest_ans != this.myData.select
        ) {
          this.myData.select = this.isHost ? data.host_ans : data.guest_ans;
          this.myData.time = this.isHost ? data.host_time : data.guest_time;
        }
      });
    },

    /*** 対戦相手が見つかった(部屋入室後)後の処理 ***/
    searched() {
      // console.log("Methods: searched");
      this.isPlaying = true; // ステータス:対戦中
      this.isSearching = false; // 検索を終えて対戦相手の画像を出現させる

      // 問題の参照をを用いて問題データを取得する
      for (const questionRef of this.questionRefs) {
        // question は DocumentReference
        questionRef.get().then((querySnapshot) => {
          const data = querySnapshot.data();

          this.questions.push({
            year: questionRef.parent.parent.id,
            season: questionRef.parent.id,
            no: questionRef.id, // 問番号
            body: data.text, // 問題文
            option1: data.ans1,
            option2: data.ans2,
            option3: data.ans3,
            option4: data.ans4,
            correctAns: data.correctAns,
            questionImageUrl: data.questionImageUrl,
            answerAllImageUrl: data.answerAllImageUrl,
            answerImageUrl1: data.answerImageUrl1,
            answerImageUrl2: data.answerImageUrl2,
            answerImageUrl3: data.answerImageUrl3,
            answerImageUrl4: data.answerImageUrl4,
          });
        });
      }

      // 相手表示と同時にメッセージはフェードアウト(animateでopacityを変更して高さを確保)
      $("#message span").animate(
        {
          opacity: 0,
        },
        this.SPEED_FADE,
        () => {
          this.startBattle(); // 対戦開始
        }
      );
    },

    /*** 対戦を開始する ***/
    startBattle() {
      // console.log("Methods: startBattle");
      const message = $("#message span");
      this.message_num++; // 「対戦を開始します」

      // 少し待ってから実行
      setTimeout(() => {
        this.isShowQuestionArea = true; // 問題エリアを表示する
        $(".score").each((index, element) => {
          $(element).animate(
            {
              opacity: 1, // スコアを表示する
            },
            this.SPEED_FADE_SLOW,
            () => {
              // eachブロックの中で1度だけ実行したいため、index:0を判定する
              if (index == 0) {
                // 少し待ってから実行
                setTimeout(() => {
                  // メッセージ「対戦を開始します」をフェードイン
                  message.animate(
                    {
                      opacity: 1,
                    },
                    this.SPEED_FADE,
                    () => {
                      // 少し待ってから実行
                      setTimeout(() => {
                        this.resetPlayerStatus(); // プレイヤーの状態をリセットする
                        this.nextQuestion(); // 出題開始
                      }, 2000);
                    }
                  );
                }, 1500);
              }
            }
          ); // End: animate
        }); // End: each
      }, 1500);
    }, // End: afterEnterShowOpp

    /*** 次の問題へ進む ***/
    nextQuestion() {
      // console.log("Methods: nextQuestion");

      if (this.question_now < this.NUM_QUESTION) {
        this.question_now++; // 次の問題へ
      } else {
        this.unsubscribe(); // リアルタイムリスナーを破棄
        this.endBattle(); // 全問題を終えていたら終了処理へ
        return;
      }

      const message = $("#message span");

      this.winner = null; // 勝敗結果をリセット
      this.isShowJudge = false; // 判定結果を非表示
      this.isShowQuestion = false; // 問題を非表示

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
          setTimeout(() => {
            message.animate(
              {
                opacity: 1,
              },
              this.SPEED_FADE,
              () => {
                // 「第〇問」をフェードインした後の処理
                // 少し待ってから次の問題へ進む
                setTimeout(() => {
                  this.setTimer(); // 回答タイマーをセットする
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
      this.oppData.status = "selecting";
      this.myData.select = null;
      this.oppData.select = null;

      // ホストであればFirebase上のデータをリセット
      if (this.isHost) {
        this.room.update({
          host_ans: null,
          guest_ans: null,
          host_time: null,
          guest_time: null,
        });
      }
    },

    /*** 回答タイマーをセットする ***/
    setTimer(time = this.$store.state.TIMER_DEFAULT) {
      this.time_limit = time; // 時間制限の初期値
      this.$store.commit("setTimer", { time: time });
    },

    /*** 回答タイマー開始 ***/
    startTimer() {
      // console.log("Methods: startTimer");

      this.timerId = setInterval(() => {
        this.$store.commit("timer_countdown"); // カウントダウン
        // 制限時間を超えた場合の処理
        if (this.$store.state.timer_valuenow < 0) {
          clearInterval(this.timerId);
          this.timerId = null;
          // 状態:timeup にするかを判定する
          if (this.myData.status == "selecting") {
            this.myData.status = "timeup";
            this.myAns.push(null); // 時間切れ
            // Firebaseへ反映する
            if (this.isHost) {
              this.room.update({
                host_time: "timeup",
              });
            } else {
              this.room.update({
                guest_time: "timeup",
              });
            }
          }
        }
      }, 1000);
    },

    /*** 勝敗判定: 時間制限を過ぎた | 両者の回答が揃った ***/
    judge() {
      // console.log("Methods: judge");

      // フラッシュを取り除く
      document.getElementById("player1-flush").classList.remove("flush");
      document.getElementById("player2-flush").classList.remove("flush");

      // 少し待ってから処理を行う
      setTimeout(() => {
        this.isShowJudge = true; // 回答結果を表示する
        // 少し待ってから処理を行う
        setTimeout(() => {
          this.showJudgeDetail(); // 1問の勝敗結果を表示して得点を反映する

          // 少し待ってから次の問題へ
          setTimeout(() => {
            this.winner = null;
            this.nextQuestion();
          }, 4000);
        }, 1500);
      }, 1000);
    },

    /*
     * 回答結果を表示して得点を反映する
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
    showJudgeDetail() {
      const mySelect = this.myData.select; // 自分の回答
      const oppSelect = this.oppData.select; // 相手の回答
      const myTime = this.myData.time; // 自分の回答タイム
      const oppTime = this.oppData.time; // 相手の回答タイム
      const correctAns = this.questions[this.question_now - 1].correctAns; // 正答
      if (
        (mySelect == correctAns && oppSelect != correctAns) ||
        (mySelect == correctAns && oppSelect == correctAns && myTime < oppTime)
      ) {
        document.getElementById("player1-flush").classList.add("flush");
        this.winner = 1; // 自分の勝ち
        this.myData.score++;
      } else if (
        (oppSelect == correctAns && mySelect != correctAns) ||
        (oppSelect == correctAns && mySelect == correctAns && oppTime < myTime)
      ) {
        document.getElementById("player2-flush").classList.add("flush");
        this.winner = 2; // 相手の勝ち
        this.oppData.score++;
      } else {
        this.winner = 0; // 引き分け
      }
    },

    /*** 全問題が終了後 ***/
    endBattle() {
      // console.log("Methods: endBattle");
      const message = $("#message span");
      this.isPlaying = false; // ステータス: 対戦終了
      clearInterval(this.blinkIntervalId);

      // メッセージをフェードアウトする
      message.fadeOut(this.SPEED_FADE, () => {
        // フェードアウト後の処理
        this.message_num++; // 「終了！」
        message.fadeIn(this.SPEED_FADE, () => {
          // 「終了！」フェードイン後の処理
          // 少し待ってから実行する
          setTimeout(() => {
            this.isShowQuestionArea = false; // 問題非表示
            if (this.isHost) this.room.delete(); // 部屋削除

            // 勝敗結果を反映する
            if (this.myData.score > this.oppData.score) {
              this.myData.status = "win";
              this.oppData.status = "lose";
            } else if (this.myData.score < this.oppData.score) {
              this.myData.status = "lose";
              this.oppData.status = "win";
            } else {
              this.myData.status = "draw";
              this.oppData.status = "draw";
            }

            // 少しの間紙吹雪を出現させる
            this.isShowConfetti = true;
            setTimeout(() => {
              this.isShowConfetti = false; // 紙吹雪非表示
            }, 10000);

            // 少し待ってから再戦ボタンを出現させる
            setTimeout(() => {
              this.isShowRestart = true;
            }, 3000);
          }, 2000);
        });
      });
    },

    /*** もう一度対戦を行う ***/
    restart() {
      // console.log("Methods: restart");
      this.isShowConfetti = false; // 花吹雪を消す
      this.isShowRestart = false; // もう一度/振り返り のエリアを消す
      // スコアをフェードアウトする
      $(".score").each((index, element) => {
        $(element).animate(
          {
            opacity: 0, // スコアを非表示
          },
          this.SPEED_FADE,
          // スコアのフェードアウトが終わったあとの処理
          () => {
            // eachブロックの中で1度だけ実行したいため、index:0を判定する
            if (index == 0) {
              this.search();
            }
          }
        );
      });
    },

    /*** モーダルの実行処理 ***/
    execModal(next) {
      // console.log("Methods: execModal");
      document.getElementById("next").onclick = () => {
        $("body").removeClass("modal-open");
        $(".modal-backdrop").remove();
        this.routeLeave(next); // OK
      };
      $("#exampleModal").on("hidden.bs.modal", () => {
        next(false); // キャンセル
      });
    },

    /*** 画面遷移時の処理 ***/
    routeLeave(next) {
      clearInterval(this.timerId); // タイマーを停止する
      clearInterval(this.blinkIntervalId);
      this.$store.commit("setTimer", { time: null });
      if (this.unsubscribe != null) {
        this.unsubscribe(); // リアルタイムリスナーを破棄する
      }
      next();
    },

    /*** PlayerComponent - 「選択中」を点滅させる ***/
    blink() {
      if (this.blinkIntervalId == null) {
        this.blinkIntervalId = setInterval(() => {
          // 「選択中」を点滅させる
          $(".blink").fadeOut(500).fadeIn(500);
        }, 3000);
      }
    },

    /*** QuestionComponent - 回答時の処理 ***/
    selected(ans) {
      // console.log("Methods: selected");

      // 自分の回答をFirebaseに反映する
      if (this.isHost) {
        this.room.update({
          host_ans: ans,
          host_time: this.time_limit - this.$store.state.timer_valuenow,
        });
      } else {
        this.room.update({
          guest_ans: ans,
          guest_time: this.time_limit - this.$store.state.timer_valuenow,
        });
      }
    },
  }, // End: methods
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Itim&display=swap');
.messageArea {
  padding: 0.3em 1em;
  margin-bottom: 1em;
  background: white;
  border-right: solid 0.4rem #5f5f91; /* 線 */
  border-left: solid 0.4rem #5f5f91;
  border-radius: 10px; /* 角の丸み */
  text-align: center;
  span {
    color: #5e5ebc; /* 文字色 */
    font-weight: bold;
    font-size: 1rem;
  }
}
.score {
  opacity: 0;
  width: 100%;
  color: midnightblue;
  font-size: 2.5rem;
  line-height: 1;
  font-family: 'Itim', cursive;
}
.loading {
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
}
.player1,
.player2 {
  border-radius: 5%;
}
.flush-area {
  height: 100%;
  width: 20%;
}
.flush {
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 25%,
    #ffd1f9 50%,
    rgba(255, 255, 255, 0) 75%
  );
  animation: slide_line 1.5s ease-in-out forwards;
  @keyframes slide_line {
    from {
      margin-left: -20%;
    }
    to {
      margin-left: 120%;
    }
  }
}
.review {
  color: #333333;
}
</style>
