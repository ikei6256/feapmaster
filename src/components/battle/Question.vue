<template>
  <div class="pb-4">
    <!--- ここから: 問題表示エリア --->
    <div class="question-content">
      <transition name="fade">
        <div v-if="isShowQuestion">
          <!-- 問題文 -->
          <div class="pa-2 pa-sm-4">
            <p class="question-body mb-0" v-html="questions[question_now -1].body"></p>
            <div v-if="questions[question_now-1].questionImageUrl !== null" class="text-center mt-2 mt-sm-4">
              <img :src="questions[question_now-1].questionImageUrl" alt="Question Image" style="max-width: 100%" />
            </div>
          </div>

          <v-divider class="mx-1 mx-sm-2"></v-divider>

          <!-- 回答 -->
          <div class="options pa-2 pa-sm-4">
            <div v-if="questions[question_now-1].answerAllImageUrl !== null" class="text-center">
              <img :src="questions[question_now-1].answerAllImageUrl" alt="回答用イメージ" />
            </div>
            <div v-for="n in 4" :key="n">
              <v-btn
                class="text-left mt-2 px-0 py-2"
                @click="selected($event, n)"
                :disabled="myData.status != 'selecting'"
                height="auto"
                width="100%"
                text
                v-ripple="{ class: 'blue--text text--darken-1' }"
              >
                <v-icon>{{ options[n-1] }}</v-icon>
                <span class="option-text pl-2 pl-sm-4">{{ questions[question_now-1].options[n-1] }}</span>
                <img v-if="questions[question_now-1].answerImageUrls[n-1] !== null" :src="questions[question_now-1].answerImageUrls[n-1]" alt="Option Image" />
              </v-btn>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!--- ここまで: 問題表示エリア --->

    <!--- ここから: 結果表示モーダル --->
    <!-- 2人対戦 -->
    <v-dialog
      v-if="!MODE_4PLAYERS && isShowQuestion"
      :value="isShowJudge"
      content-class="mx-1"
      width="500"
      transition="scroll-y-transition"
      hide-overlay
      persistent
      no-click-animation
    >
      <v-card color="grey lighten-5">
        <div class="wrap-result text-center">
          <div class="result-header py-2">
            <span class="judge_title berlin-sans">JUDGE</span>
            <v-btn class="judge_close" icon x-small @click.stop="closeDialogResult"
              ><v-icon>{{ icons.mdiClose }}</v-icon></v-btn
            >
            <span v-if="winner === 1" class="judge berlin-sans red--text">WIN</span>
            <span v-else-if="winner === 2" class="judge berlin-sans blue--text">LOSE</span>
            <span v-else class="judge berlin-sans green--text">DRAW</span>
          </div>
          <div class="result-body py-3">
            <div class="name pb-3">
              <span class="left px-1 px-sm-2">{{ myData.name }}</span>
              <span class="right px-1 px-sm-2">{{ oppData1.name }}</span>
            </div>
            <div class="detail white--text py-2 my-2">
              <span class="detail-item">回答</span>
              <div class="left detail-ans-left">
                {{ options[myData.select-1] }}
                <span v-if="myData.select === null">-</span>
                <v-icon v-else-if="questions[question_now-1].correctAns === myData.select" size="0.9rem" color="green">{{ icons.mdiCircleOutline }}</v-icon>
                <v-icon v-else size="0.9rem" color="red">{{ icons.mdiCloseThick }}</v-icon>
              </div>
              <div class="right detail-ans-right">
                {{ options[oppData1.select-1] }}
                <span v-if="oppData1.select === null">-</span>
                <v-icon v-else-if="questions[question_now-1].correctAns === oppData1.select" size="0.9rem" color="green">{{ icons.mdiCircleOutline }}</v-icon>
                <v-icon v-else size="0.9rem" color="red">{{ icons.mdiCloseThick }}</v-icon>
              </div>
            </div>
            <div class="detail white--text py-2 my-2">
              <span class="detail-item">タイム</span>
              <span v-if="myData.status !== 'timeup'" class="left">{{ myData.time | formatTime }}</span>
              <span v-else class="left">-</span>
              <span v-if="oppData1.status !== 'timeup'" class="right">{{ oppData1.time | formatTime }}</span>
              <span v-else class="right">-</span>
            </div>
          </div>
          <div class="result-footer py-4">
            <div class="left text-left pl-1 pl-sm-2">
              正答:<span class="correctAns pl-1">{{ options[questions[question_now-1].correctAns-1] }}</span>
            </div>
            <div class="right text-right grey--text text--darken-1 pr-1 pr-sm-2">自動で次の問題へ進みます</div>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- 4人対戦 -->
    <v-dialog
      v-else-if="MODE_4PLAYERS && isShowQuestion && rankings.length !== 0"
      :value="isShowJudge"
      content-class="mx-1"
      width="500"
      transition="scroll-y-transition"
      hide-overlay
      persistent
      no-click-animation
    >
      <v-card color="grey lighten-5">
        <div class="wrap-result4 text-center">
          <div class="result-header py-2">
            <span class="judge_title berlin-sans">JUDGE</span>
            <v-btn class="judge_close" icon x-small @click.stop="closeDialogResult"
              ><v-icon>{{ icons.mdiClose }}</v-icon></v-btn
            >
            <span class="rank red--text text--lighten-2">{{ myData.rank_tmp }}位</span><span class="rank-point ml-1 grey--text text--darken-1">[+3]</span>
          </div>
          <div class="result-body py-1 py-sm-2">
            <div class="head mb-2 mb-sm-4">
              <span class="rank">順位</span>
              <span class="name">名前</span>
              <span class="ans">回答</span>
              <span class="time">タイム</span>
            </div>
            <div v-for="n in 4" :key="n" class="detail white--text mb-1 mb-sm-2 py-1">
              <span class="rank">{{ Object.keys(rankings[n - 1])[0] }}位</span>
              <span class="name px-1">{{ Object.values(rankings[n - 1])[0].name }}</span>
              <span class="ans">{{ options[ Object.values(rankings[n - 1])[0].select - 1 ]}}</span>
              <span class="time">{{ Object.values(rankings[n - 1])[0].time | formatTime }}</span>
            </div>
          </div>
          <div class="result-footer py-4">
            <div class="left text-left pl-1 pl-sm-2">
              正答:<span class="correctAns pl-1">{{ options[ questions[question_now-1].correctAns - 1] }}</span>
            </div>
            <div class="right text-right grey--text text--darken-1 pr-1 pr-sm-2">自動で次の問題へ進みます</div>
          </div>
        </div>
      </v-card>
    </v-dialog>
    <!-- ここまで: 結果表示モーダル -->
  </div>
</template>

<script>
import { mdiCircleOutline, mdiCloseThick, mdiClose } from "@mdi/js";
export default {
  props: {
    isShowQuestion: Boolean,
    isShowJudge: Boolean,
    myData: Object,
    oppData1: Object,
    oppData2: Object,
    oppData3: Object,
    questions: Array,
    question_now: Number,
    winner: Number,
    MODE_4PLAYERS: Boolean,
    rankings: Array,
  },
  data() {
    return {
      icons: {
        mdiCircleOutline,
        mdiCloseThick,
        mdiClose,
      },
      options: ["ア", "イ", "ウ", "エ"],

      /* テスト用 */
      // question: {
      //   body: "問題文",
      //   questionImageUrl: null,
      //   answerAllImageUrl: null,
      //   answerImageUrls: [null, null, null, null],
      //   options: { ア: "かいとう1", イ: "回答2", ウ: "回答3", エ: "回答4" },
      //   correctAns: 1,
      // },
      // myData: {
      //   name: "あなた",
      //   photoURL: null,
      //   status: null, // selecting | waiting | timeup | win | lose | draw | error
      //   score: 0, // 得点
      //   select: 1, // 回答番号
      //   time: 30, // 回答タイム(秒)
      // },
      // oppData1: {
      //   name: "あいて",
      //   photoURL: null,
      //   status: null,
      //   score: 0,
      //   select: 2,
      //   time: 180,
      // },
      // oppData2: {
      //   name: "あいて2",
      //   photoURL: null,
      //   status: null,
      //   score: 0,
      //   select: 2,
      //   time: 150,
      // },
      // isShowQuestion: true,
      // isShowJudge: true,
      // rankings: [
      //   {"1": {name: "あああ", select: 1, time: 150}},
      //   {"1": {name: "いいい", select: 1, time: 100}},
      //   {"3": {name: "ううう", select: 3, time: 120}},
      //   {"-": {name: "えええ", select: 4, time: 80}},
      // ],
    };
  },
  watch: {
    isShowQuestion: function (val) {
      if (val === false) {
        setTimeout(() => {

        }, 500);
      }
    }
  },
  filters: {
    // 秒数を受け取って 0:00 の形式に直す
    formatTime(val) {
      // マイナス値をとるときは何もしない
      if (val < 0) {
        return;
      }

      const minute = Math.floor(val / 60);
      let second = Math.floor(val % 60);
      if (second < 10) {
        second = "0" + second; // ゼロパディングを付与
      }
      return "" + minute + ":" + second;
    },
  },
  methods: {
    selected(event, ans) {
      this.$emit("selected", ans); // 回答番号をBattleComponentへ送る
      event.currentTarget.style.backgroundColor = "#E3F2FD"; // ボタンに色をつける
    },
    closeDialogResult() {
      this.$emit("toggleShowJudge");
    },
  },
};
</script>

<style lang="scss" scoped>
$battle-blue: #113bad;

.question-content {
  min-height: 22rem;
  background-color: #fff;
  border-right: solid 0.5rem $battle-blue;
  border-left: solid 0.5rem $battle-blue;
  border-radius: 0.5rem;
  transition: all 1s;

  .question-body,
  .option-text {
    font-size: 0.875rem;
    line-height: 1.5;
    letter-spacing: 0.05rem;
  }

  .options {
    .v-btn {
      display: inline-block; // デフォルト flex
      justify-content: left; // デフォルト center
      text-transform: none; // デフォルト uppercase
      white-space: normal; // デフォルト nowrap
      background-color: rgba(0, 0, 0, 0.02);
    }

    .option-btn {
      .v-icon {
        color: inherit;
      }
      .option-text {
        line-height: 1.5;
      }
    }
  }
}

/* --------------------
 * 結果表示モーダル
 * -------------------- */
// 共通
.result-header {
  position: relative;

  .judge_title {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    font-size: 0.8rem;
    color: #9e9e9e;
  }
  .judge_close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
}
.result-footer {
  display: grid;
  grid-template:
    "left right"
    / 1fr 1fr;
  font-size: 0.875rem;

  .left {
    grid-area: left;

    .correctAns {
      font-weight: bold;
    }
  }
  .right {
    grid-area: right;
  }
}

// 2人用
.wrap-result {
  .result-header {
    .judge {
      font-size: 2.5rem;
      text-shadow: 1px 1px 0 rgba(68, 68, 68, 0.8);
    }
  }

  .result-body {
    background: linear-gradient(to right, #bbdefb 50%, #ffcdd2 50%);
    font-weight: bold;

    .name {
      display: grid;
      grid-template:
        "left right"
        / 1fr 1fr;
      font-weight: bold;
      letter-spacing: 0.01rem;
      white-space: nowrap;
      text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
      line-height: normal; // 絵文字に対応する

      .left,
      .right {
        overflow: hidden;
        text-overflow: ellipsis; // 「...」の表示
      }
      .left {
        grid-area: left;
      }
      .right {
        grid-area: right;
      }
    }

    .detail {
      position: relative;
      display: grid;
      grid-template:
        "left right"
        / 1fr 1fr;
      align-items: center;
      min-height: 1.5rem;
      background-color: rgba(0, 0, 0, 0.6);
      font-size: 0.9rem;
      letter-spacing: 0.1rem;

      .detail-ans-right,
      .detail-ans-left {
        letter-spacing: normal;
      }

      .detail-item {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        margin: auto;
      }

      .left {
        grid-area: left;
      }
      .right {
        grid-area: right;
      }
    }
  }
}

// 4人用
.wrap-result4 {
  .result-header {
    .rank {
      font-family: NotoSansJP;
      font-weight: 900;
      font-size: 2rem;
      text-shadow: 1px 1px 0 rgba(68, 68, 68, 0.5);
    }
    .rank-point {
      font-family: NotoSansJP;
      font-weight: 700;
      font-size: 0.875rem;
    }
  }

  .result-body {
    font-family: NotoSansJP;
    background: linear-gradient(to right, #ffcdd2 12.5%, #bbdefb 10%);

    .head,
    .detail {
      display: grid;
      grid-template:
        "rank name ans time"
        / 0.5fr 1.5fr 1fr 1fr;
      align-items: center;
      letter-spacing: 0.02rem;

      .rank {
        grid-area: rank;
      }
      .name {
        grid-area: name;
      }
      .ans {
        grid-area: ans;
      }
      .time {
        grid-area: time;
      }
    }

    .head {
      font-size: 0.9rem;
      text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
    }

    .detail {
      font-size: 0.875rem;
      font-weight: bold;
      background-color: rgba(0, 0, 0, 0.6);

      .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; // 「...」の表示にする
        line-height: normal; // 絵文字に対応するため
      }
    }
  }
}
</style>
