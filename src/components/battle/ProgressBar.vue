<template>
  <v-progress-linear class="bar" :value="timer_percentage" height="1rem" rounded>
    <span class="progress-text px-2">{{ timer_valuenow | formatTime }}</span>
  </v-progress-linear>
</template>

<script>
export default {
  props: {
    timer_limit: Number,
    timer_valuenow: Number,
  },
  computed: {
    timer_percentage() {
      return (this.timer_valuenow / this.timer_limit) * 100;
    },
  },
  filters: {
    // 秒数を受け取って 0:00 の形式に直す
    formatTime(val) {
      const minute = Math.floor(val / 60);
      let second = Math.floor(val % 60);
      if (second < 10) {
        second = "0" + second;
      }
      return "" + minute + ":" + second;
    },
  },
};
</script>

<style lang="scss" scoped>
.bar {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

  .progress-text {
    font-size: 0.875rem;
    letter-spacing: 0.05rem;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 1rem;
  }
}
</style>
