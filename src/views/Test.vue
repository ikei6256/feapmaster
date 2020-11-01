<template>
  <div class="container">
    <h1>テスト用ページ</h1>
    <h1>BootStrap - Spinner</h1>
    <button id="btn-alert" class="btn btn-primary">5秒後にアラート</button>
    <h1>Animate - Using @keyframes</h1>
    <p class="my-element">My Element</p>
  </div>
</template>

<script>
var timer = null;
export default {
  mounted() {
    console.log("--- Test: mounted ---");

    document.getElementById("btn-alert").onclick = function () {
      this.disabled = true;
      this.innerHTML =
        '<span class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>Loading...';

      // beforeDestroyでclearTimeoutする
      console.log('5秒後にアラート');
      timer = setTimeout(() => {
        alert('TestComponent: alert');
        timer = null;
        this.disabled = false;
        this.innerHTML = '5秒後にアラート';
      }, 5000);
    };
  },
  beforeRouteLeave(to, from, next) {
    console.log("--- Test: beforeRouteLeave ---");

    if (timer) {
      clearTimeout(timer);
      timer = null;
      console.log('タイマーをリセットしました。');
    }

    next();
  },
};
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");

.my-element {
  animation: fadeIn; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 5s; /* don't forget to set a duration! */
}
</style>
