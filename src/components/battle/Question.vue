<template>
  <div>
    <progressbar></progressbar>
    <div class="questionArea">
      <!-- 問題本文 -->
      <div class="questionBody">
        <transition name="fade">
          <div v-if="isShowQuestion">
            {{ question.body }}
            <div
              v-if="question.questionImageUrl != null"
              class="text-center pt-2 pb-2"
            >
              <img :src="question.questionImageUrl" alt="問題イメージ" />
            </div>
          </div>
        </transition>
      </div>

      <hr />

      <transition name="fade">
        <div v-if="isShowQuestion" class="mb-4">
          <div v-if="question.answerAllImageUrl != null">
            <img
              :src="question.answerAllImageUrl"
              alt="回答用イメージ"
              class="pb-2"
            />
          </div>
          <div class="option pb-1">
            <button
              @click="selected($event, 1)"
              class="btn btn-outline-dark btn-option"
              :disabled="myData.status != 'selecting'"
            >
              ア
            </button>
            <span v-if="question.option1 != 'ア'">{{ question.option1 }}</span>
            <img
              v-if="question.answerImageUrl1 != null"
              :src="question.answerImageUrl1"
              alt="回答用イメージその1"
              class="pt-1 pb-1"
            />
          </div>
          <div class="option pb-1">
            <button
              @click="selected($event, 2)"
              class="btn btn-outline-dark btn-option"
              :disabled="myData.status != 'selecting'"
            >
              イ
            </button>
            <span v-if="question.option2 != 'イ'">{{ question.option2 }}</span>
            <img
              v-if="question.answerImageUrl2 != null"
              :src="question.answerImageUrl2"
              alt="回答用イメージその2"
              class="pt-1 pb-1"
            />
          </div>
          <div class="option pb-1">
            <button
              @click="selected($event, 3)"
              class="btn btn-outline-dark btn-option"
              :disabled="myData.status != 'selecting'"
            >
              ウ
            </button>
            <span v-if="question.option3 != 'ウ'">{{ question.option3 }}</span>
            <img
              v-if="question.answerImageUrl3 != null"
              :src="question.answerImageUrl3"
              alt="回答用イメージその3"
              class="pt-1 pb-1"
            />
          </div>
          <div class="option">
            <button
              @click="selected($event, 4)"
              class="btn btn-outline-dark btn-option"
              :disabled="myData.status != 'selecting'"
            >
              エ
            </button>
            <span v-if="question.option4 != 'エ'">{{ question.option4 }}</span>
            <img
              v-if="question.answerImageUrl4 != null"
              :src="question.answerImageUrl4"
              alt="回答用イメージその4"
              class="pt-1 pb-1"
            />
          </div>
        </div>
      </transition>

      <!-- 結果 -->
      <transition name="fade">
        <div v-if="isShowJudge" class="result">
          <p class="correctAns">
            正答
            <span class="correctAns-option">{{
              option[question.correctAns - 1]
            }}</span>
            <!-- 勝敗結果 -->
            <transition name="fade">
              <span v-if="winner == 1" class="ml-2 text-danger judge" key="win"
                >WIN</span
              >
              <span
                v-else-if="winner == 2"
                class="ml-2 text-secondary judge"
                key="lose"
                >LOSE</span
              >
              <span
                v-else-if="winner == 0"
                class="ml-2 text-success judge"
                key="draw"
                >DRAW</span
              >
            </transition>
          </p>
          <p class="myResult">
            {{ myData.name }}
            <span v-if="myData.select != null">
              <span class="myResult-select">{{
                option[myData.select - 1]
              }}</span>
              [タイム: {{ myData.time | to_ms }}]
            </span>
            <span v-else class="text-danger">時間切れ</span>
          </p>
          <p class="oppAns">
            {{ oppData.name }}
            <span v-if="oppData.select != null">
              <span class="oppResult-select">{{
                option[oppData.select - 1]
              }}</span>
              [タイム: {{ oppData.time | to_ms }}]
            </span>
            <span v-else class="text-danger">時間切れ</span>
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import ProgressBar from "./ProgressBar";
// import $ from 'jquery';
export default {
  components: {
    progressbar: ProgressBar,
  },
  props: {
    myData: Object,
    oppData: Object,
    question_now: Number,
    question: Object,
    isShowQuestion: Boolean,
    isShowJudge: Boolean,
    time_limit: Number,
    winner: Number,
  },
  data() {
    return {
      option: ["ア", "イ", "ウ", "エ"],
    };
  },
  filters: {
    // 秒数を受け取って0:00の形式に直す
    to_ms(val) {
      var minute = Math.floor(val / 60);
      var second = Math.floor(val % 60);
      if (second < 10) {
        second = "0" + second;
      }
      return "" + minute + ":" + second;
    },
  },
  mounted() {
    // console.log("--- Question: mounted ---");
  },
  methods: {
    selected(event, ans) {
      // console.log("--- Question - Methods: selected ---");

      // ボタンの色を変更する処理
      console.log(event);

      this.$emit("selected", ans); // 回答番号をBattleComponentへ送る
    },
  },
};
</script>

<style lang="scss">
.questionArea {
  min-height: 30rem;
  padding: 1rem;
  margin-bottom: 2rem;
  background: white;
  border-right: solid 0.5rem #5f5f91; /* 線 */
  border-left: solid 0.5rem #5f5f91; /* 線 */
  border-radius: 10px; /* 角の丸み */
  color: #404040;
}
.questionBody {
  min-height: 1.5rem;
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
    background: repeating-linear-gradient(
      -45deg,
      #e6b9f8,
      #e6b9f8 2px,
      white 2px,
      white 4px
    );
  }
}
.correctAns-option,
.judge,
.myResult-select,
.oppResult-select {
  font-size: 1.5rem;
}
.myResult {
  font-weight: bold;
}

/* ******************************
RIPPLES EFFECT
****************************** */
.ripples {
  overflow: hidden;
  position: relative;
}
.waves {
  position: absolute;
  display: block;
  border-radius: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(0);
}
.ripple {
  animation: ripple 30s linear;
  @keyframes ripple {
    100% {
      opacity: 0;
      transform: scale(2.5);
    }
  }
}

/* ******************************
BUTTONS
****************************** */
.btn {
  overflow: hidden;
  // cursor: pointer;
  position: relative;
  z-index: 10;
  // display: inline-block;
  // height: 36px;
  // line-height: 36px;
  // vertical-align: middle;
  // border: none;
  // padding: 0 16px;
  white-space: nowrap;
  // letter-spacing: 1px;
  text-transform: uppercase;
  text-decoration: none;
  // text-align: center;
  // font-weight: 400;
  // font-size: 14px;
  // color: #212121;
  // background-image: none;
  // background-color: #E0E0E0;

  // -webkit-border-radius: 2px;
  // -moz-border-radius: 2px;
  // border-radius: 2px;

  // -webkit-box-shadow: none;
  // -moz-box-shadow: none;
  // box-shadow: none;

  // -webkit-transition: all 0.2s ease;
  // -moz-transition: all 0.2s ease;
  // -o-transition: all 0.2s ease;
  transition: all 0.2s ease;

  // -ms-touch-action: manipulation;
  touch-action: manipulation;

  // -webkit-user-select: none;
  // -moz-user-select: none;
  // -ms-user-select: none;
  // user-select: none;

  // -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* ----- BUTTON STATES ----- */
.btn:focus,
.btn:active:focus,
.btn.active:focus,
.btn.focus,
.btn:active.focus,
.btn.active.focus {
  outline: none;
}

.btn:hover,
.btn:focus,
.btn.focus {
  // color: #212121;
  text-decoration: none;
}

.btn:active,
.btn.active {
  outline: 0;
  background-image: none;
}

.btn.disabled,
.btn[disabled],
fieldset[disabled] .btn {
  // cursor: not-allowed;
  pointer-events: none;
  opacity: 0.5;
  filter: alpha(opacity=50);
}
</style>
