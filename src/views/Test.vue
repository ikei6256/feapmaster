<template>
  <div>
    <input type="file" @change="onFileChange">
  </div>
</template>

<script>
import firebase from "../firebase";
export default {
  data() {
    return {
      imagesRef: null,
    }
  },
  mounted() {
    // const imagesRef = firebase.storage().ref().child("userImage");
    // console.log(imagesRef);

    this.imagesRef = firebase.storage().ref().child("testImage/");

  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0] || e.dataTransfer.files[0];
      this.imagesRef.put(file).then((snapshot) => {
        console.log(snapshot);
      })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
