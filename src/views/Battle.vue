<template>
  <div class="mt-2 mt-sm-4">
    <!-- 紙吹雪 -->
    <transition name="fade">
      <confetti v-if="isShowConfetti"></confetti>
    </transition>

    <!-- メッセージ -->
    <div id="message" class="area-message text-center py-1 py-sm-2">
      <span>{{ message }}</span>
    </div>

    <!-- ここから: プレイヤー表示エリア -->
    <div class="area-players mt-2 mt-sm-4">
      <player class="player1" :playerData="myData" :isShowPlayerStatus="isShowPlayerStatus"></player>

      <div class="player2">
        <!-- <transition name="fade-slow" mode="out-in">
          <span v-if="isSearching">相手を探しています...</span>
          <player v-else :playerData="oppData" :isShowPlayerStatus="isShowPlayerStatus" @blink="blink"></player>
        </transition> -->
        <player :playerData="myData" :isShowPlayerStatus="isShowPlayerStatus"></player>
      </div>
    </div>
    <!-- ここまで: プレイヤー表示エリア -->

    <!-- プログレスバー -->
    <transition name="fade-slow">
      <!-- <div v-if="isShowQuestionArea" class="mt-2 mt-sm-4 px-1 px-sm-2"> -->
      <div v-if="true" class="mt-2 mt-sm-4 px-1 px-sm-2">
        <progressbar :timer_limit="timer_limit" :timer_valuenow="timer_valuenow"></progressbar>
      </div>
    </transition>

    <!-- ここから: 問題表示エリア -->
    <transition name="fade-slow">
      <!-- <question
        @selected="selected"
        v-if="isShowQuestionArea"
        :myData="myData"
        :oppData="oppData"
        :question_now="question_now"
        :question="questions[question_now - 1]"
        :isShowQuestion="isShowQuestion"
        :isShowJudge="isShowJudge"
        :winner="winner"
      ></question> -->

      <div v-if="true" class="my-2 my-sm-4">
        <question></question>
      </div>
    </transition>
    <!-- ここまで: 問題表示 -->

    <!-- ここから: 対戦終了後の表示エリア  -->
    <transition name="fade">
      <div v-show="isShowRestart">
        <div class="text-center mb-3">
          <button @click="restart" class="btn btn-primary mr-1">もう一度</button>
          <router-link :to="{ name: 'Home' }">
            <button class="btn btn-secondary">ホームへ戻る</button>
          </router-link>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="isShowReview">
        <div>
          <p class="mb-1 ml-1 review">▼振り返り</p>
          <review :questions="questions" :myAns="myAns"></review>
        </div>
      </div>
    </transition>
    <!-- ここから: 対戦終了後の表示エリア -->

    <!-- ここから: Modal -->
    <v-dialog v-model="dialog_battle_cancel" width="500" transition="scroll-y-transition" hide-overlay>
      <v-card>
        <v-card-title class="yellow lighten-2"><v-icon>mdi-alert-circle-outline</v-icon>注意</v-card-title>
        <v-card-text class="pl-5 py-2">対戦を中止して画面を離れてもよろしいですか？</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="routeLeave" color="#FA3E7E">対戦をやめる<v-icon>mdi-stop-circle</v-icon></v-btn>
          <v-btn text @click="dialog_battle_cancel = false" color="primary">対戦を続ける<v-icon>mdi-play-circle</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ここまで: Modal-->
  </div>
</template>

<script>
import Player from "@/components/battle/Player.vue";
import { mapMutations, mapState } from "vuex";
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
      SPEED_FADE: 350, // フェードイン/フェードアウトの入れ替え速度 350
      SPEED_FADE_SLOW: 700,
      NUM_QUESTION: 5, // 総問題数

      TIMER_DEFAULT: 150, // 制限時間のデフォルト値
      timer_limit: 0, // 制限時間
      timer_valuenow: 0,
      timerId: null, // カウントダウンタイマーのIDを保存する

      room: null, // 部屋のDocumentReference
      unsubscribe: null, // リアルタイムリスナーの破棄に使用する
      nextLocation: null, // 画面遷移メソッド
      myData: {
        name: null,
        photoURL: null,
        status: null, // selecting | waiting | timeup | win | lose | draw | error
        score: 0, // 得点
        select: null, // 回答番号
        time: null, // 回答タイム(秒)
      },
      oppData: {
        name: null,
        photoURL: null,
        status: null,
        score: 0,
        select: null,
        time: null,
      },
      // 匿名用のランダムな画像と名前
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
      name_random: [
        "ラパン",
        "チオビタ",
        "ごぱん",
        "ポリデント",
        "半沢",
        "まちゅぴちゅ",
        "スーパームーン",
        "サンズ",
        "たぬきち",
        "らーめん",
        "IKEA",
        "くま",
        "忍者",
        "凄腕ハッカー",
        "りす",
        "かもめ",
        "のりせんべい",
        "七味",
        "もぐら",
        "神",
        "プードル",
        "ピーマン",
        "きれいなジャイアン",
        "シンデレラ",
        "クロックス",
        "だし巻きたまご",
        "ネプチューン",
        "しらす",
        "迷宮入り",
        "真実はいつも一つ",
        "タピオカ",
        "ミタゾノ",
        "キューピー",
        "みかん",
        "ダヴィンチ",
        "ムツゴロウ",
        "あめんぼ",
        "ユンケル",
        "あまびえ",
        "チキンラーメン",
        "ダイヤモンド",
        "ベルベットハンマー矢沢",
        "チェインレクイエム斎藤",
        "ふくろう",
        "マシュマロ",
        "焼きおにぎり",
        "焼肉定食",
        "ピグレット",
        "フェアレディ",
        "JAXA",
        "メロン",
        "生クリーム",
        "亀仙人",
        "テトリス",
        "ダークホース",
        "野菜生活",
        "パピコ",
        "チョコチップクッキー",
      ],

      timeoutId: null,
      blinkIntervalId: null, // 「選択中」を点滅させるためのInterval ID

      isHost: null, // 部屋のホストかゲストか
      isSearching: true, // 対戦相手検索中
      isShowQuestionArea: false, // 問題表示エリアを表示するタイミングを制御する
      isShowQuestion: false, // 問題を表示するタイミングを制御する
      isShowPlayerStatus: false, // プレイヤーの状態を表示するタイミングを制御する
      isShowJudge: false, // 結果を表示するタイミングを制御する
      isShowConfetti: false, // 紙吹雪を表示するタイミングを制御する
      isShowRestart: false, // 「もう一度」ボタンを表示するタイミングを制御する
      isShowReview: false, // 振り返りを表示するタイミングを制御する
      dialog_battle_cancel: false, // 対戦中止を決定するモーダルの表示フラグ

      question_now: 0, // 現在の問題数
      questionRefs: [], // 問題の参照
      questions: [], // 実際の問題データ
      myAns: [], // 自分が回答したデータを保存する
      winner: null, // 勝敗 --- 0 引き分け | 1 自分 | 2 相手
      message_num: 0,
      messages: ["待機中...", "対戦を開始します！", "第1問", "第2問", "第3問", "第4問", "第5問", "終了!", "接続エラーが発生しました。"],
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
      if (val != null) {
        this.myAns.push(val);
        this.myData.status = "waiting";
        // 両者が回答していればタイマーを止めて勝敗判定を行う
        if (this.oppData.select != null) {
          clearInterval(this.timerId);
          this.judge();
        }
      }
    },
    "oppData.select": function (val) {
      if (val != null) {
        this.oppData.status = "waiting";
        if (this.myData.select != null) {
          clearInterval(this.timerId);
          this.judge();
        }
      }
    },
    /*** ここまで: 回答が選択されたときの処理 ***/

    /*** ここから: ステータス変更時の処理 ***/
    "myData.status": function (val) {
      // 時間切れの場合の処理
      if (val == "timeup" && (this.oppData.select != null || this.oppData.status == "timeup")) {
        this.judge(); // 相手が回答済みか時間切れの場合判定処理へ
      }
    },
    "oppData.status": function (val) {
      if (val == "timeup" && (this.myData.select != null || this.myData.status == "timeup")) {
        this.judge(); // 自分が回答済みか時間切れの場合判定処理へ
      }
    },
    /*** ここまで: 時間切れの場合の処理 ***/
  },
  beforeMount() {
    // サインインユーザであるか確認してname、photoURLをセットする
    if (this.currentUser == null) {
      // this.myData.name = this.name_random[Math.floor(Math.random() * this.name_random.length)];
      this.myData.name = "あなた";
      this.myData.photoURL = `/img/${this.image_random[Math.floor(Math.random() * this.image_random.length)]}.png`;
    } else {
      this.myData.name = this.currentUser.name;
      this.myData.photoURL = this.currentUser.photoURL;
    }
  },
  mounted() {
    window.addEventListener("beforeunload", () => {
      if (this.room != null) {
        this.room.delete();
      }
    });

    // this.search(); // 対戦相手を検索する
  },
  beforeRouteLeave(to, from, next) {
    this.nextLocation = next;
    // 対戦画面から離れる時対戦中なら確認メッセージを表示する
    if (this.isPlaying) {
      this.dialog_battle_cancel = true; // モーダルを表示する
    } else {
      this.routeLeave();
    }
  },
  beforeDestroy() {
    if (this.unsubscribe != null) {
      this.unsubscribe(); // リアルタイムリスナーを破棄する
    }

    if (this.room != null) {
      this.room.delete(); // 部屋を削除
    }
  },
  methods: {
    ...mapMutations(["stateBattleTrue", "stateBattleFalse"]),
    /*** 対戦相手を検索する ***/
    search() {
      this.message_num = 0; // 「待機中...」
      this.question_now = 0;
      this.isSearching = true; // ステータス:検索中
      this.isShowPlayerStatus = false;
      this.isShowQuestion = false;
      this.isShowJudge = false;
      this.questionRefs = [];
      this.questions = [];
      this.myAns = [];
      this.oppData.name = null;
      this.oppData.photoURL = null;
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
            // 空き部屋が無い場合
            this.isHost = true; // ホストで参加
            this.createRoom(); // 部屋を作成する
          } else {
            // 空き部屋がある場合
            this.isHost = false; // ゲストで参加

            // 相手の情報をローカルに保存する
            this.room = querySnapshot.docs[0].ref;
            if (this.oppData.name === "あなた") {
              this.oppData.name = "ゲストユーザ";
            } else {
              this.oppData.name = querySnapshot.docs[0].get("host_name");
            }
            this.oppData.photoURL = querySnapshot.docs[0].get("host_photoURL");
            if (this.oppData.photoURL == null) this.oppData.photoURL = "/img/Squirrel.png";

            // 問題の参照型を取得する
            const refs = querySnapshot.docs[0].get("questions");

            // 取得した参照型でDocumentReferenceを取得する
            for (let ref of refs) {
              this.questionRefs.push(this.db.doc(ref.path));
            }

            this.createObserver(); // リアルタイムリスナー作成
          }
        });
    },

    /*** ホストの場合部屋を作成する ***/
    createRoom() {
      this.setQuestionRefs(); // 問題(Reference)をランダムに設定する
      this.db
        .collection("rooms")
        .add({
          host_name: this.myData.name, // ホスト名
          guest_name: null, // ゲスト名
          host_photoURL: this.myData.photoURL, // サインインユーザでない場合はnull
          guest_photoURL: null,
          host_time: null, // ホスト回答タイム
          guest_time: null, // ゲスト回答タイム
          host_ans: null, // ホスト回答
          guest_ans: null, // ゲスト回答
          questions: this.questionRefs, // ランダムな問題の参照リスト
          _ver: "dev",
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
        const year = 2019;
        const season = Math.floor(Math.random() * 2) == 0 ? "spring" : "autumn";
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
        // 接続エラー時の処理
        if (!snapshot.exists) {
          clearTimeout(this.timeoutId); // 処理をストップ
          clearInterval(this.timerId); // タイマーストップ
          this.unsubscribe(); // リアルタイムリスナーを破棄する
          this.stateBattleFalse();
          this.isShowQuestionArea = false; // 問題エリアを非表示
          this.oppData.status = "error";
          this.myData.status = "error";
          this.message_num = this.messages.length - 1; // 「接続エラーが発生しました。」
          $("#message span").css({ opacity: 1 });
          // 少し待つ
          this.timeoutId = setTimeout(() => {
            this.timeoutId = null;
            this.isShowRestart = true; // 再戦ボタンを表示
          }, 3000);
          return;
        }

        const data = snapshot.data();

        // 検索中の処理
        if (this.isSearching) {
          // 自身がホストの場合、相手の名前をローカルに保存する
          if (this.isHost && data.guest_name != null) {
            if (data.guest_name === "あなた") {
              this.oppData.name = "ゲストユーザ";
            } else {
              this.oppData.name = data.guest_name;
            }
            this.oppData.photoURL = data.guest_photoURL != null ? data.guest_photoURL : "/img/Squirrel.png";
          }
          // 自身がゲストの場合、自身の名前と画像をドキュメントに反映する
          if (!this.isHost && data.guest_name == null) {
            this.room.update({
              guest_name: this.myData.name,
              guest_photoURL: this.myData.photoURL,
              // guest_photoURL: null,
            });
            return;
          }
          // 両者が揃ったときに検索終了
          if (data.host_name != null && data.guest_name != null) {
            this.searched();
            return;
          }
        }

        // 相手の回答をローカルに反映する
        if (this.isHost ? data.guest_ans : data.host_ans != null && this.isHost ? data.guest_ans : data.host_ans != this.oppData.select) {
          this.oppData.select = this.isHost ? data.guest_ans : data.host_ans;
          this.oppData.time = this.isHost ? data.guest_time : data.host_time;
        } else if (this.isHost ? data.guest_time : data.host_time == "timeup") {
          // 相手が時間切れの場合
          this.oppData.status = "timeup";
        }
        // 自分の回答をローカルに反映する
        if (this.isHost ? data.host_ans : data.guest_ans != null && this.isHost ? data.host_ans : data.guest_ans != this.myData.select) {
          this.myData.select = this.isHost ? data.host_ans : data.guest_ans;
          this.myData.time = this.isHost ? data.host_time : data.guest_time;
        }
      });
    },

    /*** 対戦相手が見つかった(部屋入室後)後の処理 ***/
    searched() {
      this.stateBattleTrue(); // ステータス:対戦中
      this.isSearching = false; // 検索を終えて対戦相手の画像を出現させる
      this.blink();

      // 問題の参照を用いて問題データを取得する
      for (let questionRef of this.questionRefs) {
        // questionRef は DocumentReference
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
      const message = $("#message span");
      this.message_num++; // 「対戦を開始します」

      // 少し待ってから実行
      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;
        this.isShowQuestionArea = true; // 問題エリアを表示する
        $(".score").each((index, element) => {
          $(element).animate(
            {
              opacity: 1, // スコアを表示する
            },
            this.SPEED_FADE_SLOW,
            () => {
              // eachブロックの中で1度だけ実行したいため、index:0を判定する
              if (index === 0) {
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
              }
            }
          ); // End: animate
        }); // End: each
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
                  this.timer_limit = this.TIMER_DEFAULT; // ひとまず制限時間にデフォルトタイムをセット
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
      // 少し待ってから処理を行う
      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;
        this.isShowJudge = true; // 回答結果を表示する
        // 少し待ってから処理を行う
        this.timeoutId = setTimeout(() => {
          this.timeoutId = null;
          this.showJudgeDetail(); // 1問の勝敗結果を表示して得点を反映する

          // 少し待ってから次の問題へ
          this.timeoutId = setTimeout(() => {
            this.timeoutId = null;
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
      if ((mySelect == correctAns && oppSelect != correctAns) || (mySelect == correctAns && oppSelect == correctAns && myTime < oppTime)) {
        this.winner = 1; // 自分の勝ち
        this.myData.score++;
      } else if ((oppSelect == correctAns && mySelect != correctAns) || (oppSelect == correctAns && mySelect == correctAns && oppTime < myTime)) {
        this.winner = 2; // 相手の勝ち
        this.oppData.score++;
      } else {
        this.winner = 0; // 引き分け
      }
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
            this.timeoutId = setTimeout(() => {
              this.timeoutId = null;
              this.isShowConfetti = false; // 紙吹雪非表示
            }, 10000);

            // 少し待ってから再戦ボタンを出現させる
            this.timeoutId = setTimeout(() => {
              this.timeoutId = null;
              this.isShowRestart = true;
              this.isShowReview = true;
            }, 3000);
          }, 2000);
        });
      });
    },

    /*** もう一度対戦を行う ***/
    restart() {
      this.isShowConfetti = false; // 花吹雪を消す
      this.isShowReview = false; // 「振り返り」のエリアを消す
      this.isShowRestart = false; // 「もう一度」のエリアを消す
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

    /*** 画面遷移時の処理 ***/
    routeLeave() {
      clearTimeout(this.timeoutId); // 現在進行中のtimeout処理を停止
      clearInterval(this.timerId); // タイマーを停止する
      clearInterval(this.blinkIntervalId);
      if (this.unsubscribe != null) {
        this.unsubscribe(); // リアルタイムリスナーを破棄する
      }
      if (this.room != null) {
        this.room.delete();
        this.room = null;
      }
      this.nextLocation();
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
      // 自分の回答をFirebaseに反映する
      if (this.isHost) {
        this.room.update({
          host_ans: ans,
          host_time: this.timer_limit - this.timer_valuenow,
        });
      } else {
        this.room.update({
          guest_ans: ans,
          guest_time: this.timer_limit - this.timer_valuenow,
        });
      }
    },
  }, // End: methods
};
</script>

<style lang="scss">
// 対戦中に画面を離れる時の注意メッセージモーダル
.v-dialog {
  position: absolute;
  top: 0;
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
    / minmax(0.2rem, auto) minmax(auto, 49.5%) minmax(0.2rem, auto) minmax(auto, 49.5%) minmax(0.2rem, auto);

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
</style>
