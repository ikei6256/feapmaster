<template>
  <div class="progress mb-3 mr-1 ml-1" style="height: 5px">
    <div
      class="progress-bar bg-bar"
      role="progressbar"
      :style="styles"
      :aria-valuenow="getTimerPercentage"
      aria-valuemin="0"
      aria-valuemax="100"
    ></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters(["getTimerPercentage"]),
    styles() {
      return {
        width: this.getTimerPercentage + "%",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.bg-bar {
  background-color: steelblue;
}
</style>
