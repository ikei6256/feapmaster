<template>
  <div class="mypage">
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["user"]),
  }
};
</script>

<style lang="scss" scoped>
.mypage {
  display: grid;
  // grid-template:
}
</style>