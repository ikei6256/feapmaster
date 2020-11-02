<template>
  <div class="container"></div>
</template>

<script>
export default {
  mounted() {
    // console.log("--- Test2: mounted---");

    // const db = firebase.firestore();
    // const rooms = db.collection("rooms");
    // rooms.get().then((querySnapshot) => {
    //   querySnapshot.forEach((queryDocumentSnapshot) => {
    //     // console.log(queryDocumentSnapshot.data());

    //   });
    // });
  },
  // methods: {
  //   async getQuerySnapshot(collectionReference) {
  //     console.log("Methods: getQuerySnapshot");

  //     try {
  //       // キャッシュからドキュメントを取得
  //       return await collectionReference.get({ source: "cache" });
  //     } catch (error) {
  //       // ドキュメントがキャッシュされていない場合はサーバーから取得
  //       if (error.code === "unavailable") {
  //         console.log("サーバーから取得");
  //         return collectionReference.get({ source: "server" });
  //       }
  //       throw error;
  //     }
  //   },
  // },
};
</script>

