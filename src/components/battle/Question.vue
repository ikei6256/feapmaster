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
          <v-btn
            class="text-left mt-2 px-0 py-2"
            @click="selected($event, 1)"
            :disabled="myData.status != 'selecting'"
            height="auto"
            width="100%"
            text
          >
            <v-icon>ア</v-icon>
            <span v-if="question.option1 !== null" class="option-text pl-2 pl-sm-4" v-html="question.option1"></span>
            <img v-if="question.answerImageUrl1 !== null" :src="question.answerImageUrl1" alt="Option Image 1" />
          </v-btn>
          <v-btn
            class="text-left mt-2 px-0 py-2"
            @click="selected($event, 2)"
            :disabled="myData.status != 'selecting'"
            height="auto"
            width="100%"
            text
          >
            <v-icon>イ</v-icon>
            <span v-if="question.option2 !== null" class="option-text mb-0 pl-2 pl-sm-4" v-html="question.option2"></span>
            <img v-if="question.answerImageUrl2 !== null" :src="question.answerImageUrl2" alt="Option Image 2" />
          </v-btn>
          <v-btn
            class="text-left mt-2 px-0 py-2"
            @click="selected($event, 3)"
            :disabled="myData.status != 'selecting'"
            height="auto"
            width="100%"
            text
          >
            <v-icon>ウ</v-icon>
            <span v-if="question.option3 !== null" class="option-text mb-0 pl-2 pl-sm-4" v-html="question.option3"></span>
            <img v-if="question.answerImageUrl3 !== null" :src="question.answerImageUrl3" alt="Option Image 3" />
          </v-btn>
          <v-btn
            class="text-left mt-2 px-0 py-2"
            @click="selected($event, 4)"
            :disabled="myData.status != 'selecting'"
            height="auto"
            width="100%"
            text
          >
            <v-icon>エ</v-icon>
            <span v-if="question.option4 !== null" class="option-text mb-0 pl-2 pl-sm-4" v-html="question.option4"></span>
            <img v-if="question.answerImageUrl4 !== null" :src="question.answerImageUrl3" alt="Option Image 4" />
          </v-btn>
        </div>
      </div>
    </transition>
    <!-- ここまで: 問題表示エリア -->

    <!-- 結果表示エリア -->
    <transition name="fade">
      <div v-if="isShowJudge" class="result">
        <p class="correctAns">
          正答
          <span>{{ option[question.correctAns - 1] }}</span>
          <!-- 勝敗結果 -->
          <transition name="fade">
            <span v-if="winner == 1" key="win">WIN</span>
            <span v-else-if="winner == 2" key="lose">LOSE</span>
            <span v-else-if="winner == 0" key="draw">DRAW</span>
          </transition>
        </p>
        <p>
          {{ myData.name }}
          <span v-if="myData.select != null">
            <span>{{ option[myData.select - 1] }}</span>
            [タイム: {{ myData.time | to_ms }}]
          </span>
          <span v-else>時間切れ</span>
        </p>
        <p>
          {{ oppData.name }}
          <span v-if="oppData.select != null">
            <span>{{ option[oppData.select - 1] }}</span>
            [タイム: {{ oppData.time | to_ms }}]
          </span>
          <span v-else>時間切れ</span>
        </p>
      </div>
    </transition>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: {
    myData: Object,
    oppData: Object,
    question_now: Number,
    // question: Object, // 仮の問題データを置く
    isShowQuestion: Boolean,
    isShowJudge: Boolean,
    winner: Number,
  },
  data() {
    return {
      option: ["ア", "イ", "ウ", "エ"],
      question: {
        body: "もんだいぶん",
        questionImageUrl: null,
        answerAllImageUrl: null,
        answerImageUrl1: null,
        answerImageUrl2: null,
        answerImageUrl3: null,
        answerImageUrl4: null,
        option1: "かいとう1",
        option2: "かいとう2",
        option3: "かいとう3",
        option4: "かいとう4"
      }
    };
  },
  watch: {
    // 正誤判定が表示されるタイミングで正答の背景色を変える
    isShowJudge: function (val) {
      if (val) {
        // 色をつける
        $(`.option:eq(${this.question.correctAns - 1})`).css("background-color", "rgba(249, 182, 15, 0.2)");
      }
    },
  },
  filters: {
    // 秒数を受け取って 0:00 の形式に直す
    to_ms(val) {
      var minute = Math.floor(val / 60);
      var second = Math.floor(val % 60);
      if (second < 10) {
        second = "0" + second;
      }
      return "" + minute + ":" + second;
    },
  },
  methods: {
    selected(event, ans) {
      this.$emit("selected", ans); // 回答番号をBattleComponentへ送る
    },
  },
};
</script>

<style lang="scss" scoped>
$battle-blue: #113bad;

.question {
  min-height: 30rem;
  background-color: #fff;
  border-right: solid 0.5rem $battle-blue;
  border-left: solid 0.5rem $battle-blue;
  border-radius: 0.5rem;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

  .question-body {
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
    .option-text {
      line-height: 1.5;
    }
  }
}

.result {
  border-top: solid 1rem #e6b9f8;
  border-bottom: solid 1rem #e6b9f8;
  padding: 1rem 0.5rem;
}
.correctAns {
  position: relative;
  padding: 0.3em;
  ::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0.5rem;
    background: repeating-linear-gradient(-45deg, #e6b9f8, #e6b9f8 2px, white 2px, white 4px);
  }
}
</style>
