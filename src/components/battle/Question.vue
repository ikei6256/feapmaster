<template>
  <div>
    <progressbar></progressbar>
    <div class="questionArea pt-3 pb-3 pl-1 pr-1 p-sm-3">
      <!-- 問題本文 -->
      <div class="questionBody pb-2 mb-2">
        <transition name="fade">
          <div v-if="isShowQuestion">
            {{ question.body }}
            <div v-if="question.questionImageUrl != null" class="text-center pt-2 pb-2">
              <img :src="question.questionImageUrl" alt="問題イメージ" style="max-width: 100%" />
            </div>
          </div>
        </transition>
      </div>
      <transition name="fade">
        <div v-if="isShowQuestion" class="mb-4">
          <div v-if="question.answerAllImageUrl != null">
            <img :src="question.answerAllImageUrl" alt="回答用イメージ" class="pb-2" />
          </div>
          <div class="option mb-1">
            <div class="d-table-cell">
              <button @click="selected($event, 1)" class="btn btn-outline-dark btn-option mr-1" :disabled="myData.status != 'selecting'">ア</button>
            </div>
            <div class="d-table-cell">
              <span v-if="question.option1 != 'ア'">{{ question.option1 }}</span>
              <img v-if="question.answerImageUrl1 != null" :src="question.answerImageUrl1" alt="回答用イメージその1" class="pt-1 pb-1" />
            </div>
          </div>
          <div class="option mb-1">
            <div class="d-table-cell">
              <button @click="selected($event, 2)" class="btn btn-outline-dark btn-option mr-1" :disabled="myData.status != 'selecting'">イ</button>
            </div>
            <div class="d-table-cell">
              <span v-if="question.option2 != 'イ'">{{ question.option2 }}</span>
              <img v-if="question.answerImageUrl2 != null" :src="question.answerImageUrl2" alt="回答用イメージその2" class="pt-1 pb-1" />
            </div>
          </div>
          <div class="option mb-1">
            <div class="d-table-cell">
              <button @click="selected($event, 3)" class="btn btn-outline-dark btn-option mr-1" :disabled="myData.status != 'selecting'">ウ</button>
            </div>
            <div class="d-table-cell">
              <span v-if="question.option3 != 'ウ'">{{ question.option3 }}</span>
              <img v-if="question.answerImageUrl3 != null" :src="question.answerImageUrl3" alt="回答用イメージその3" class="pt-1 pb-1" />
            </div>
          </div>
          <div class="option mb-1">
            <div class="d-table-cell">
              <button @click="selected($event, 4)" class="btn btn-outline-dark btn-option mr-1" :disabled="myData.status != 'selecting'">エ</button>
            </div>
            <div class="d-table-cell">
              <span v-if="question.option4 != 'エ'">{{ question.option4 }}</span>
              <img v-if="question.answerImageUrl4 != null" :src="question.answerImageUrl4" alt="回答用イメージその4" class="pt-1 pb-1" />
            </div>
          </div>
        </div>
      </transition>

      <!-- 結果 -->
      <transition name="fade">
        <div v-if="isShowJudge" class="result">
          <p class="correctAns">
            正答
            <span class="correctAns-option">{{ option[question.correctAns - 1] }}</span>
            <!-- 勝敗結果 -->
            <transition name="fade">
              <span v-if="winner == 1" class="ml-2 text-danger judge" key="win">WIN</span>
              <span v-else-if="winner == 2" class="ml-2 text-secondary judge" key="lose">LOSE</span>
              <span v-else-if="winner == 0" class="ml-2 text-success judge" key="draw">DRAW</span>
            </transition>
          </p>
          <p class="myResult">
            {{ myData.name }}
            <span v-if="myData.select != null">
              <span class="myResult-select">{{ option[myData.select - 1] }}</span>
              [タイム: {{ myData.time | to_ms }}]
            </span>
            <span v-else class="text-danger">時間切れ</span>
          </p>
          <p class="oppAns">
            {{ oppData.name }}
            <span v-if="oppData.select != null">
              <span class="oppResult-select">{{ option[oppData.select - 1] }}</span>
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
import $ from "jquery";
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
  watch: {
    // 正誤判定が表示されるタイミングで正答の背景色を変える
    isShowJudge: function(val) {
      if (val) {
        // 色をつける
        $(`.option:eq(${this.question.correctAns-1})`).css("background-color", "#f2ddbf")
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
      var waves, d, x, y;

      /*** ボタンに色をつける ***/
      if ($(event.target).find(".waves").length === 0) {
        $(event.target).prepend('<span class="waves"></span>');
      }

      waves = $(event.target).find(".waves");
      waves.removeClass("ripple");

      if (!waves.height() && !waves.width()) {
        d = Math.max($(event.target).outerWidth(), $(event.target).outerHeight());
        waves.css({ height: d, width: d });
      }

      x = event.pageX - $(event.target).offset().left - waves.width() / 2;
      y = event.pageY - $(event.target).offset().top - waves.height() / 2;

      $(event.target).css({ color: "white" });
      waves.css({ top: y + "px", left: x + "px" }).addClass("ripple");
      /**********/

      this.$emit("selected", ans); // 回答番号をBattleComponentへ送る
    },
  },
};
</script>

<style lang="scss" scoped>
.questionArea {
  min-height: 30rem;
  margin-bottom: 2rem;
  background: white;
  border-right: solid 0.5rem #5f5f91; /* 線 */
  border-left: solid 0.5rem #5f5f91; /* 線 */
  border-radius: 10px; /* 角の丸み */
  color: #404040;
}
.questionBody {
  min-height: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.option {
  border-radius: 5px;
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
BUTTONS
****************************** */
.btn {
  overflow: hidden;
  position: relative;
  z-index: 10;
  white-space: nowrap;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.2s ease;
  touch-action: manipulation;
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
  background-color: #0094c4;
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
  pointer-events: none;
}
</style>

<style lang="scss">
/* ******************************
RIPPLES EFFECT https://codepen.io/bootpen/pen/WrWZRd
****************************** */
.ripples {
  overflow: hidden;
  position: relative;
}
.waves {
  z-index: -1;
  position: absolute;
  display: block;
  border-radius: 100%;
  background-color: rgb(0, 148, 196);
  transform: scale(0);
}
.ripple {
  animation: ripple 0.65s linear forwards;
  @keyframes ripple {
    100% {
      transform: scale(2.5);
    }
  }
}
</style>
