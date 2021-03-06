<template>
  <v-expansion-panels v-model="panel" accordion hover multiple>
    <v-expansion-panel v-for="(question, i) in questions" :key="i">
      <v-expansion-panel-header color="light-green lighten-5" disable-icon-rotate>
        <span class="question-body">{{ question.body }}</span>
        <template v-if="myAns[i] !== null" v-slot:actions>
          <v-icon v-if="question.correctAns === myAns[i]" color="green" size="1.2rem">{{ icons.mdiCheckCircle }}</v-icon>
          <v-icon v-else color="red" size="1.2rem">{{ icons.mdiCloseThick }}</v-icon>
        </template>
      </v-expansion-panel-header>

      <v-expansion-panel-content>
        <div class="review-content pt-4 pt-sm-2">
          <span class="question-data grey--text text--darken-2">{{ question | formatQuestionData }}</span>
          <div v-if="question.questionImageUrl !== null" class="text-center my-2 my-sm-4">
            <img :src="question.questionImageUrl" alt="Question Image" style="max-width: 100%" />
            <v-divider class="my-2 my-sm-4"></v-divider>
          </div>
          <div v-if="question.answerAllImageUrl !== null" class="text-center my-2 my-sm-4">
            <img :src="question.answerAllImageUrl" alt="Answer Image" />
          </div>
          <ul class="pl-0">
            <li v-for="(value, index) in question.options" :key="index" class="my-2 my-sm-4">
              <div v-if="value !== null" class="question-option">
                <v-icon size="1.2rem">{{ options[index] }}</v-icon>
                <span v-if="value !== null" class="question-option-text pl-2 pl-sm-4">{{ value }}</span>
                <img v-if="question.answerImageUrls[index] !== null" :src="question.answerImageUrls[index]" alt="Option Image" class="pl-2 pl-sm-4" />
              </div>
            </li>
          </ul>

          <v-divider class="my-2 my-sm-4"></v-divider>

          <div class="judge mt-2 mt-sm-4">
            <p class="my-2 my-sm-4">
              あなたの回答:
              <span v-if="myAns[i] !== null" class="judge-myAns pl-1">
                {{ options[myAns[i] - 1] }}
                <v-icon v-if="question.correctAns === myAns[i]" color="green" size="0.9rem">{{ icons.mdiCircleOutline }}</v-icon>
                <v-icon v-else color="red" size="0.9rem">{{ icons.mdiCloseThick }}</v-icon>
              </span>
              <span v-else class="grey--text text--darken-1">-</span>
            </p>
            <p class="mb-0">
              正答:<span class="judge-correctAns pl-1">{{ options[question.correctAns - 1] }}</span>
            </p>
          </div>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mdiCircleOutline, mdiCloseThick, mdiCheckCircle } from "@mdi/js";
export default {
  props: {
    questions: Array,
    myAns: Array,
  },
  data() {
    return {
      icons: {
        mdiCircleOutline,
        mdiCloseThick,
        mdiCheckCircle,
      },
      panel: [],
      options: ["ア", "イ", "ウ", "エ"],
    };
  },
  filters: {
    formatQuestionData: function (question) {
      const season = question.season === "spring" ? "春" : "秋";
      const date = question.season === "spring" ? new Date(question.year, 4, 1, 0, 0, 0) : new Date(question.year, 10, 1, 0, 0, 0);
      const dateParts = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {era: 'long'}).formatToParts(date);

      let era = "";

      // 例: "令和元年"
      for (let i = 0; i < 3; i++) {
        era += dateParts[i].value
      }

      return era + "(" + question.year + ")" + season + " 問" + question.no;
    },
  },
};
</script>

<style lang="scss" scoped>
.question-body,
.question-option-text,
.judge {
  letter-spacing: 0.05rem;
  line-height: 1.5;
  font-size: 0.875rem;
}
.review-content {
  position: relative;

  .question-data {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 0.75rem;
    letter-spacing: 0.05rem;
  }

  .question-option {
    display: flex;
    align-items: center;
  }
  .judge {
    text-indent: 1rem;
    .judge-myAns,
    .judge-correctAns {
      font-weight: bold;
    }
  }
}
</style>
