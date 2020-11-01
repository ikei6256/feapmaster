<template>
  <div class="progress mb-3 mr-1 ml-1" style="height: 5px">
    <div
      class="progress-bar bg-bar"
      role="progressbar"
      :style="styles"
      :aria-valuenow="$store.getters.getTimerPercentage"
      aria-valuemin="0"
      aria-valuemax="100"
    ></div>
  </div>
</template>

<script>
export default {
  computed: {
    styles() {
      return {
        width: this.$store.getters.getTimerPercentage + "%",
      };
    },
  },
  mounted() {
    console.log("--- ProgressBar: mounted ---");
  },
};
</script>

<style scoped>
.bg-bar {
  background-color: steelblue;
}
</style>
