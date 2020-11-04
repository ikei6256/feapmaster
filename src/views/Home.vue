<template>
  <div class="container">
    <h1>ホーム</h1>
    <router-link :to="{ name: 'Battle' }">
      <button class="btn btn-primary">バトル!</button>
    </router-link>
    <!-- <router-link :to="{ name: 'Test' }">
      <button class="btn btn-outline-success">テスト</button>
    </router-link>
    <router-link :to="{ name: 'Test2' }">
      <button class="btn btn-outline-success">テスト2</button>
    </router-link>
    <router-link :to="{ name: 'Test3' }">
      <button class="btn btn-outline-success">テスト3</button>
    </router-link>
    <button id="addRoom" type="button" class="btn btn-outline-warning">テスト部屋追加</button> -->
  </div>
</template>

<script>
// import firebase from "../firebase";
export default {
  mounted() {
    // const db = firebase.firestore();

    // // 部屋追加ボタン
    // document.getElementById("addRoom").onclick = function () {
    //   db.collection("rooms").add({
    //     host_name: "げすとさん", // ホスト名 「ゲスト2」が既に部屋を立てていたことにする
    //     guest_name: null, // ゲスト名
    //     host_photoUrl: null, // サインインユーザでない場合はnull
    //     guest_photoUrl: null,
    //     host_time: null, // ホスト回答タイム
    //     guest_time: null, // ゲスト回答タイム
    //     host_ans: null, // ホスト回答
    //     guest_ans: null, // ゲスト回答
    //     // 問題 2020年秋の問題1～5を仮に置いておく
    //     questions: [
    //       db.doc("questions/2020/autumn/01"),
    //       db.doc("questions/2020/autumn/02"),
    //       db.doc("questions/2020/autumn/03"),
    //       db.doc("questions/2020/autumn/04"),
    //       db.doc("questions/2020/autumn/05"),
    //     ],
    //   });
    // };
  },
};
</script>
