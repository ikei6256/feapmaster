<template>
  <div class="accordion" id="accordion">
    <div v-for="(question, index) in questions" :key="'question.body' + index" class="card">
      <div class="card-header" :id="'heading' + index">
        <h2 class="mb-0">
          <button
            class="btn btn-link btn-block text-left text-truncate"
            type="button"
            data-toggle="collapse"
            :data-target="'#collapse' + index"
            aria-expand="true"
            :aria-controls="'collapse' + index"
          >
            {{ question.body }}
          </button>
        </h2>
      </div>

      <div :id="'collapse' + index" class="collapse" :aria-labelledby="'heading' + index" data-parent="#accordion">
        <div class="card-body">
          <div class="question pb-2 mb-2">
            <div class="row ml-0 mr-0">
              <div class="col-auto p-0"><span class="toi pr-1 pl-1 mr-2">問</span></div>
              <div class="col p-0">{{ question.body }}</div>
            </div>
            <div v-if="question.questionImageUrl != null" class="text-center pt-2">
              <img :src="question.questionImageUrl" alt="問題イメージ" />
            </div>
          </div>
          <div v-if="question.answerAllImageUrl != null">
            <img :src="question.answerAllImageUrl" alt="回答用イメージ" class="pb-1">
          </div>
          <div class="mb-2 pb-2 options">
            <p class="mb-1 ml-1">
              <span class="mr-3">ア</span>
              <span v-if="question.option1 != 'ア'">{{ question.option1 }}</span>
              <img
                v-if="question.answerImageUrl1 != null"
                :src="question.answerImageUrl1"
                alt="回答用イメージその1"
                class="pt-1 pb-1"
              />
            </p>
            <p class="mb-1 ml-1">
              <span class="mr-3">イ</span>
              <span v-if="question.option2 != 'イ'">{{ question.option2 }}</span>
              <img
                v-if="question.answerImageUrl2 != null"
                :src="question.answerImageUrl2"
                alt="回答用イメージその2"
                class="pt-1 pb-1"
              />
            </p>
            <p class="mb-1 ml-1">
              <span class="mr-3">ウ</span>
              <span v-if="question.option3 != 'ウ'">{{ question.option3 }}</span>
              <img
                v-if="question.answerImageUrl3 != null"
                :src="question.answerImageUrl3"
                alt="回答用イメージその3"
                class="pt-1 pb-1"
              />
            </p>
            <p class="mb-1 ml-1">
              <span class="mr-3">エ</span>
              <span v-if="question.option4 != 'エ'">{{ question.option4 }}</span>
              <img
                v-if="question.answerImageUrl4 != null"
                :src="question.answerImageUrl4"
                alt="回答用イメージその4"
                class="pt-1 pb-1"
              />
            </p>
          </div>
          <p class="mb-1"><span class="ans pr-1 pl-1 mr-2">答</span>{{ option[question.correctAns - 1] }}</p>
          <p class="mb-1">
            <span class="myAns pr-1 pl-1 mr-2">あなたの回答</span>
            <span v-if="myAns[index] != null">{{ option[myAns[index] - 1] }}</span>
            <span v-else class="text-muted">時間切れ</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    questions: Array,
    myAns: Array,
  },
  data() {
    return {
      option: ["ア", "イ", "ウ", "エ"],
    };
  },
  mounted() {
    // console.log("--- Review: mounted ---");
  }
};
</script>

<style lang="scss" scoped>
.question,
.options {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.toi {
  background-color: #ebebf4;
  color: #4747a5;
  border-radius: 50%;
}
.ans {
  background-color: #f4ebeb;
  color: #8c2a2a;
  border-radius: 50%;
}
.myAns {
  background-color: #eafcf2;
  border-radius: 25%;
}
</style>
