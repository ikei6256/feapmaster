<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="500px" hide-overlay>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on"> Open Dialog </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">プロフィール編集</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field label="名前"></v-text-field>
            <v-text-field label="メール" hint="例: test@example.com"></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-2" text @click="dialog = false">キャンセル</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">編集する</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
  }),
};
</script>
