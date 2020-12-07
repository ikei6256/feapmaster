<template>
  <div class="question">
    <!-- ここから: 問題表示エリア -->
    <transition name="fade">
      <div v-if="isShowQuestion">
        <!-- 問題文 -->
        <div class="pa-2 pa-sm-4">
          <p class="question-body mb-0" v-html="question.body"></p>
          <div v-if="question.questionImageUrl !== null" class="text-center mt-2 mt-sm-4">
            <img :src="question.questionImageUrl" alt="Question Image" style="max-width: 100%" />
          </div>
        </div>

        <v-divider class="mx-1 mx-sm-2"></v-divider>

        <!-- 回答 -->
        <div class="options pa-2 pa-sm-4">
          <div v-if="question.answerAllImageUrl !== null" class="text-center">
            <img :src="question.answerAllImageUrl" alt="回答用イメージ" />
          </div>
          <div v-for="(value, key, index) in question.options" :key="index">
            <v-btn
              class="text-left mt-2 px-0 py-2"
              @click="selected($event, index + 1)"
              :disabled="myData.status != 'selecting'"
              height="auto"
              width="100%"
              text
              v-ripple="{ class: 'blue--text text--darken-1' }"
            >
              <v-icon>{{ key }}</v-icon>
              <span v-if="value !== null" class="option-text pl-2 pl-sm-4">{{ value }}</span>
              <img v-if="question.answerImageUrls[index] !== null" :src="question.answerImageUrls[index]" alt="Option Image" />
            </v-btn>
          </div>
        </div>

        <!-- ここから: 結果表示モーダル -->
        <v-dialog :value="isShowJudge" content-class="mx-1" width="500" transition="scroll-y-transition" hide-overlay persistent no-click-animation>
          <v-card color="grey lighten-5">
            <div class="wrap-result text-center">
              <div class="result-header berlin-sans py-2">
                <span class="judge_title">JUDGE</span>
                <v-btn class="judge_close" icon x-small @click.stop="closeDialogResult"><v-icon>{{ icons.mdiClose }}</v-icon></v-btn>
                <span v-if="winner === 1" class="judge red--text">WIN</span>
                <span v-else-if="winner === 2" class="judge blue--text">LOSE</span>
                <span v-else class="judge green--text">DRAW</span>
              </div>
              <div class="result-body py-3">
                <div class="name pb-3">
                  <span class="left px-1 px-sm-2">{{ myData.name }}</span>
                  <span class="right px-1 px-sm-2">{{ oppData.name }}</span>
                </div>
                <div class="detail white--text py-2 my-2">
                  <span class="detail-item">回答</span>
                  <div class="left detail-ans-left">
                    {{ Object.keys(question.options)[myData.select - 1] }}
                    <v-icon v-if="question.correctAns === myData.select" size="0.9rem" color="green">{{ icons.mdiCircleOutline }}</v-icon>
                    <span v-else-if="myData.select === null">-</span>
                    <v-icon v-else size="0.9rem" color="red">{{ icons.mdiCloseThick }}</v-icon>
                  </div>
                  <div class="right detail-ans-right">
                    {{ Object.keys(question.options)[oppData.select - 1] }}
                    <v-icon v-if="question.correctAns === oppData.select" size="0.9rem" color="green">{{ icons.mdiCircleOutline }}</v-icon>
                    <span v-else-if="oppData.select === null">-</span>
                    <v-icon v-else size="0.9rem" color="red">{{ icons.mdiCloseThick }}</v-icon>
                  </div>
                </div>
                <div class="detail white--text py-2 my-2">
                  <span class="detail-item">タイム</span>
                  <span v-if="myData.status !== 'timeup'" class="left">{{ myData.time | formatTime }}</span>
                  <span v-else class="left">-</span>
                  <span v-if="oppData.status !== 'timeup'" class="right">{{ oppData.time | formatTime }}</span>
                  <span v-else class="right">-</span>
                </div>
              </div>
              <div class="result-footer py-4">
                <div class="left text-left pl-1 pl-sm-2">
                  正答:<span class="correctAns pl-1">{{ Object.keys(question.options)[question.correctAns - 1] }}</span>
                </div>
                <div class="right text-right grey--text text--darken-1 pr-1 pr-sm-2">自動で次の問題へ進みます</div>
              </div>
            </div>
          </v-card>
        </v-dialog>
        <!-- ここまで: 結果表示モーダル -->
      </div>
    </transition>
    <!-- ここまで: 問題表示エリア -->
  </div>
</template>

<script>
import { mdiCircleOutline, mdiCloseThick , mdiClose } from "@mdi/js";
export default {
  props: {
    isShowQuestion: Boolean,
    isShowJudge: Boolean,
    myData: Object,
    oppData: Object,
    question: Object,
    winner: Number,
  },
  data() {
    return {
      icons: {
        mdiCircleOutline,
        mdiCloseThick,
        mdiClose,
      },

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
      // oppData: {
      //   name: "あいて",
      //   photoURL: null,
      //   status: null,
      //   score: 0,
      //   select: 2,
      //   time: 180,
      // },
      // isShowQuestion: true,
      // isShowJudge: true,
      // winner: 1,
    };
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
    }
  },
};
</script>

<style lang="scss" scoped>
$battle-blue: #113bad;

.question {
  min-height: 22rem;
  background-color: #fff;
  border-right: solid 0.5rem $battle-blue;
  border-left: solid 0.5rem $battle-blue;
  border-radius: 0.5rem;

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
.wrap-result {
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
}
</style>
