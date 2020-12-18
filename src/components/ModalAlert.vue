<template>
  <v-dialog :value="isShow" content-class="modal_alert" transition="scroll-y-transition" hide-overlay @keydown="$emit('hide')">
    <v-card color="grey lighten-5">
      <v-card-title :class="title_color">
        <v-icon>mdi-alert-circle-outline</v-icon>{{ title }}
      </v-card-title>
      <v-card-text class="py-2" v-html="text"></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="actionCancel" text @click="isShow = false" color="indigo darken-3">キャンセル</v-btn>
        <v-btn v-if="actionOk" text color="primary" @click="$emit('hide')">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    isShow: Boolean,
    actionOk: Boolean,
    actionCancel: Boolean,
    title_color: String,
    title: String,
    text: String,
  },
};
</script>

<style lang="scss">
.v-dialog {
  &.modal_alert {
    position: absolute;
    top: 0; // 画面上部に配置する
    max-width: 98%;

    @media screen and (min-width: 600px) {
      width: 588px;
    }
  }
}
</style>
