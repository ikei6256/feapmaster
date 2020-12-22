<template>
  <v-snackbar :value="isShow" timeout="-1">
    <span>{{ text }}</span>
    <template v-slot:action="{ attrs }">
      <v-btn v-bind="attrs" @click="$emit('close')" icon>
        <v-icon color="#FA3E7E">mdi-close-circle-outline</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    isShow: Boolean,
    text: String,
  }
}
</script>