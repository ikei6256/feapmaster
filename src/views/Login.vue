<template>
  <div>
    <header-component></header-component>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  components: {
    "header-component": Header,
  },
};
</script>

<style scoped>
@import url("https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth.css");
</style>
