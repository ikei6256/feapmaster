<template>
  <div class="root">
    <header-component class="header"></header-component>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import { mapState } from "vuex";
export default {
  components: {
    "header-component": Header,
  },
  computed: {
    ...mapState(["auth", "user"]),
  }
};
</script>

<style lang="scss" scoped>
.root {
  grid-template:
    "... header ..."
    / minmax(2%, auto) minmax(auto, 1024px) minmax(2%, auto);
}
.header {
  grid-area: header;
}
</style>