<template>
  <div>
    <v-btn @click="click">test</v-btn>
  </div>
</template>

<script>
import firebase from "../firebase";
export default {
  methods: {
    click() {
      const imageRef = firebase.storage().ref().child("testImage/_ivory(fffff0).png");
      imageRef.getDownloadURL().then((url) => {
        console.log(url);
      })
    }
  }
};
</script>
