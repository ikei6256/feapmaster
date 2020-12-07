<template>
  <v-expansion-panels accordion hover multiple>
    <v-expansion-panel v-for="(question, i) in questions" :key="i" class="panel">
      <v-expansion-panel-header color="grey lighten-4" disable-icon-rotate>
        <span class="question-body">{{ question.body }}</span>
        <template v-if="question.correctAns === myAns[i]" v-slot:actions>
          <v-icon color="green" size="1.2rem">{{ icons.mdiCircleOutline }}</v-icon>
        </template>
        <template v-else v-slot:actions>
          <v-icon color="red" size="1.2rem">{{ icons.mdiCloseThick }}</v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div v-if="question.questionImageUrl !== null" class="text-center my-2 my-sm-4">
          <img :src="question.questionImageUrl" alt="Question Image" style="max-width: 100%"/>
          <v-divider class="my-2 my-sm-4"></v-divider>
        </div>
        <div v-if="question.answerAllImageUrl !== null" class="text-center my-2 my-sm-4">
          <img :src="question.answerAllImageUrl" alt="Answer Image" />
        </div>
        <ul class="pl-0">
          <li v-for="(value, key, index) in question.options" :key="index" class="my-2 my-sm-4">
            <div v-if="value !== null" class="question-option">
              <v-icon size="1.2rem">{{ key }}</v-icon>
              <span class="pl-2 pl-sm-4">{{ value }}</span>
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
          <p class="mb-0">正答:<span class="judge-correctAns pl-1">ア</span></p>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mdiCircleOutline, mdiCloseThick } from "@mdi/js";
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
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.panel {
  .question-body,
  .question-option span,
  .judge {
    letter-spacing: 0.05rem;
    line-height: 1.5;
    font-size: 0.875rem;
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
