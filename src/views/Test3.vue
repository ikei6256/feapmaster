<template>
  <div class="container">
    <div class="mb-2">
      <button id="button">ボタン</button>
      <progress value="35" max="100"></progress>
    </div>
    <div class="accordion" id="accordion">
      <div v-for="(question, index) in questionData" :key="'question.body' + index" class="card">
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
            <div class="row ml-0 mr-0 mb-2 pb-2 question">
              <div class="col-auto p-0"><span class="toi pr-1 pl-1 mr-2">問</span></div>
              <div class="col p-0">{{ question.body }}</div>
            </div>
            <div class="mb-2 pb-2 options">
              <p class="mb-1 ml-1"><span class="mr-2">ア</span>{{ question.option1 }}</p>
              <p class="mb-1 ml-1"><span class="mr-2">イ</span>{{ question.option2 }}</p>
              <p class="mb-1 ml-1"><span class="mr-2">ウ</span>{{ question.option3 }}</p>
              <p class="mb-1 ml-1"><span class="mr-2">エ</span>{{ question.option4 }}</p>
            </div>
            <p class="mb-1"><span class="ans pr-1 pl-1 mr-2">答</span>{{ option[question.correctAns-1] }}</p>
            <p class="mb-1"><span class="myAns pr-1 pl-1 mr-2">あなたの回答</span>{{ option[myAns[index]-1] }}</p>
          </div>
        </div>
      </div>
    </div>

    <hr>
    <button class="btn btn-outline-dark">ア</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questionData: [
        {
          year: 2020,
          season: "autumn",
          question_num: 2, // 問番号
          body: "8ビットの値の全ビットを反転する操作はどれか。",
          option1: "16進表記 00 のビット列と排他的論理和をとる。",
          option2: "16進表記 00 のビット列と論理和をとる。",
          option3: "16進表記 FF のビット列と排他的論理和をとる。",
          option4: "16進表記 FF のビット列と論理和をとる。",
          correctAns: 3,
        },
        {
          year: 2020,
          season: "autumn",
          question_num: 4,
          body:
            "a及びbを定数とする関数 f(t) = a/(t+1) 及び g(t) = b/((t^2)-t) に対して,lim g(t) / f(t) [t→∞] はどれか。ここで, a≠0，b≠0，t＞1とする。",
          option1: "0",
          option2: "1",
          option3: "b/a",
          option4: "∞",
          correctAns: 1,
        },
      ],
      myAns: [3, 2], // ウ、イを回答したとする
      option: ["ア", "イ", "ウ", "エ", "時間切れ"],
    };
  },
  mounted() {
    // console.log("--- Test3: mounted ---");

    const button = document.getElementById("button");
    button.onclick = function () {
      // console.log("クリックしました");
      // button.onclick = null;
    };
  },
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
