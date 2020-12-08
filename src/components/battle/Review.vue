<template>
  <v-expansion-panels v-model="panel" accordion hover multiple>
    <v-expansion-panel v-for="(question, i) in questions" :key="i">
      <v-expansion-panel-header color="grey lighten-4" disable-icon-rotate>
        <span class="question-body">{{ question.body }}</span>
        <template v-if="question.correctAns === myAns[i]" v-slot:actions>
          <v-icon color="green" size="1.2rem">{{ icons.mdiCheck }}</v-icon>
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
            <li v-for="(value, key, index) in question.options" :key="index" class="my-2 my-sm-4">
              <div v-if="value !== null" class="question-option">
                <v-icon size="1.2rem">{{ key }}</v-icon>
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
                {{ Object.keys(question.options)[myAns[i] - 1] }}
                <v-icon v-if="question.correctAns === myAns[i]" color="green" size="0.9rem">{{ icons.mdiCircleOutline }}</v-icon>
                <v-icon v-else color="red" size="0.9rem">{{ icons.mdiCloseThick }}</v-icon>
              </span>
              <span v-else class="grey--text text--darken-1">-</span>
            </p>
            <p class="mb-0">
              正答:<span class="judge-correctAns pl-1">{{ Object.keys(question.options)[question.correctAns - 1] }}</span>
            </p>
          </div>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mdiCircleOutline, mdiCloseThick, mdiCheck } from "@mdi/js";
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
        mdiCheck,
      },
      panel: [],

      /* テスト用 */
      // questions: [
      //   {
      //     year: 2020,
      //     season: "autumn",
      //     no: "1",
      //     body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae suscipit sequi non nam inventore fugit dicta laborum nostrum deserunt ratione! Id ullam quisquam impedit harum quis accusantium facere exercitationem aliquid?",
      //     options: [ {ア: null}, {イ: null}, {ウ: null}, {エ: null}],
      //     answerImageUrls: [null, null, null, null]
      //   },
      //   {
      //     year: 2020,
      //     season: "autumn",
      //     no: "1",
      //     body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae suscipit sequi non nam inventore fugit dicta laborum nostrum deserunt ratione! Id ullam quisquam impedit harum quis accusantium facere exercitationem aliquid?",
      //     options: {ア: null, イ: null, ウ: null, エ: null},
      //     answerImageUrls: [null, null, null, null]
      //   },
      //   {
      //     year: 2020,
      //     season: "autumn",
      //     no: "1",
      //     body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae suscipit sequi non nam inventore fugit dicta laborum nostrum deserunt ratione! Id ullam quisquam impedit harum quis accusantium facere exercitationem aliquid?",
      //     options: [ {ア: null}, {イ: null}, {ウ: null}, {エ: null}],
      //     answerImageUrls: [null, null, null, null]
      //   },
      // ],
    };
  },
  filters: {
    formatQuestionData: function (val) {
      const season = val.season === "spring" ? "春" : "秋";
      return "" + val.year + season + " 問" + val.no;
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
