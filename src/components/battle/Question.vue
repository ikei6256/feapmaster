<template>
  <div class="question">
    <!-- ここから: 問題表示エリア -->
    <transition name="fade">
      <!-- <div v-if="isShowQuestion">
        <div>
          問題文
          <div v-if="question.questionImageUrl != null" class="text-center">
            <img :src="question.questionImageUrl" alt="Question Image" />
          </div>
        </div>

        <v-divider></v-divider>

        <div>
          <div>
            <img :src="question.answerAllImageUrl" alt="回答用イメージ" />
          </div>
          <div>
            <div>
              <button @click="selected($event, 1)" :disabled="myData.status != 'selecting'">ア</button>
            </div>
            <div>
              <span v-if="question.option1 != 'ア'">{{ question.option1 }}</span>
              <img v-if="question.answerImageUrl1 != null" :src="question.answerImageUrl1" alt="回答用イメージその1" />
            </div>
          </div>
          <div>
            <div>
              <button @click="selected($event, 2)" :disabled="myData.status != 'selecting'">イ</button>
            </div>
            <div>
              <span v-if="question.option2 != 'イ'">{{ question.option2 }}</span>
              <img v-if="question.answerImageUrl2 != null" :src="question.answerImageUrl2" alt="回答用イメージその2" />
            </div>
          </div>
          <div>
            <div>
              <button @click="selected($event, 3)" :disabled="myData.status != 'selecting'">ウ</button>
            </div>
            <div>
              <span v-if="question.option3 != 'ウ'">{{ question.option3 }}</span>
              <img v-if="question.answerImageUrl3 != null" :src="question.answerImageUrl3" alt="回答用イメージその3" />
            </div>
          </div>
          <div>
            <div>
              <button @click="selected($event, 4)" :disabled="myData.status != 'selecting'">エ</button>
            </div>
            <div>
              <span v-if="question.option4 != 'エ'">{{ question.option4 }}</span>
              <img v-if="question.answerImageUrl4 != null" :src="question.answerImageUrl4" alt="回答用イメージその4" />
            </div>
          </div>
        </div>
      </div> -->

      <!-- 問題文 -->
      <div v-if="true">
        <div class="pa-2 pa-sm-4">
          <p class="question-body mb-0">
            PCとWebサーバがHTTPで通信している。PCからWebサーバ宛てのパケットでは，送信元ポート番号はPC側で割り当てた50001，宛先ポート番号は80であった。WebサーバからPCへの戻りのパケットでのポート番号の組合せはどれか。
          </p>
          <!-- 画像があれば表示する -->
          <!-- <div v-if="question.questionImageUrl != null" class="text-center"> -->
          <div class="text-center mt-2 mt-sm-4">
            <img src="/img/Bear.png" alt="Question Image" style="max-width: 100%" />
          </div>
        </div>

        <v-divider class="mx-1 mx-sm-2"></v-divider>

        <!-- 回答 -->
        <div class="area-select pa-2 pa-sm-4">
          <v-btn text>
            <v-icon>ア</v-icon>
            <span class="pl-2 pl-sm-4">
              個々の行動に対しての善しあしを得点として与えることによって，得点が最も多く得られるような方策を学習する。
            </span>
          </v-btn>
          <v-btn class="option mt-4" text block>
            <v-icon class="option-icon">イ</v-icon>
            <span class="option-text mb-0 pl-2 pl-sm-4">
              コンピュータ利用者の挙動データを蓄積し，挙動データの出現頻度に従って次の挙動を推論する。Lorem ipsum dolor sit, amet consectetur
              adipisicing elit. Quidem deserunt culpa ullam nulla cumque numquam laboriosam ipsa recusandae eum aut labore saepe similique nam
              quibusdam qui, maxime itaque tempore vitae.
            </span>
          </v-btn>
          <v-btn class="option mt-4" text block>
            <v-icon class="option-icon">ウ</v-icon>
            <p class="option-text mb-0 pl-2 pl-sm-4">
              正解のデータを提示したり，データが誤りであることを指摘したりすることによって，未知のデータに対して正誤を得ることを助ける。
            </p>
          </v-btn>
          <v-btn class="option mt-4" text block>
            <v-icon class="option-icon">エ</v-icon>
            <p class="option-text mb-0 pl-2 pl-sm-4">
              正解のデータを提示せずに，統計的性質や，ある種の条件によって入力パターンを判定したり，クラスタリングしたりする。
            </p>
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
    question: Object,
    isShowQuestion: Boolean,
    isShowJudge: Boolean,
    winner: Number,
  },
  data() {
    return {
      option: ["ア", "イ", "ウ", "エ"],
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
      // var waves, d, x, y;

      /*** ボタンに色をつける ***/
      // if ($(event.target).find(".waves").length === 0) {
      //   $(event.target).prepend('<span class="waves"></span>');
      // }

      // waves = $(event.target).find(".waves");
      // waves.removeClass("ripple");

      // if (!waves.height() && !waves.width()) {
      //   d = Math.max($(event.target).outerWidth(), $(event.target).outerHeight());
      //   waves.css({ height: d, width: d });
      // }

      // x = event.pageX - $(event.target).offset().left - waves.width() / 2;
      // y = event.pageY - $(event.target).offset().top - waves.height() / 2;

      // $(event.target).css({ color: "white" });
      // waves.css({ top: y + "px", left: x + "px" }).addClass("ripple");
      /**********/

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

  .question-body,
  .option-text {
    font-size: 0.9rem;
    line-height: 1.5;
    letter-spacing: 0.025rem;
  }


  // .option {
  //   display: grid;
  //   grid-template:
  //     "option-icon option-text"
  //     / auto 1fr;

  //   .option-icon {
  //     grid-area: option-icon;
  //   }
  //   .option-text {
  //     grid-area: option-text;
  //     align-self: center;
  //   }
  // }

  .area-select {
    .v-btn {
      padding: 0;
      width: 100%;
      justify-content: left;
      text-transform: none;
      letter-spacing: 0.025rem;
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
