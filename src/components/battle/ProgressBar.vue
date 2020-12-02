<template>
  <v-progress-linear class="bar" :value="timer_percentage" height="1rem" rounded>
    <!-- <span class="progress-text px-2">残り {{ timer_valuenow }}</span> -->
    <span class="progress-text px-2">0:00</span>
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
};
</script>

<style lang="scss" scoped>
.bar {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

  .progress-text {
    font-size: 0.875rem;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 1rem;
  }
}
</style>
