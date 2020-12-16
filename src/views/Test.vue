<template>
  <div>
    <form>
    <input type="file" @change="onFileChange" accept="image/*" required />
    </form>
  </div>
</template>

<script>
// import firebase from "../firebase";
export default {
  methods: {
    onFileChange(e) {
      const file = e.target.files[0] || e.dataTransfer.files[0];
      // console.log(file);

      // バリデーション
      // if (file.type !== "image/*") {

      // }

      // const imageRef = firebase.storage().ref().child(`userImage/${file}`);

      // アップロード処理
      // imageRef.put(`userImage/${file}`).then((snapshot) => {
      //   console.log(snapshot);
      // })

      const fr = new FileReader();

      // 読み込みが終わった時に実行
      fr.onload = e => {
        const fileType = this.getImageFileType(e.target.result);
        console.log(fileType);
      }

      fr.readAsArrayBuffer(file);

      // ファイル選択時
      // var files = evt.target.files;
      // for (var i = 0; i < files.length; i++) {
      //   var fr = new FileReader();
      //   fr.onload = function (evt) {
      //     var fileType = getImageFileType(evt.target.result);
      //     alert("fileType=" + fileType);
      //   };
      //   fr.readAsArrayBuffer(files[i]);
      // }
    },
    // イメージのファイルタイプをバイナリーレベルで調べる
    getImageFileType(arrayBuffer) {
      var ba = new Uint8Array(arrayBuffer);
      var headerStr = "";
      var headerHex = "";
      for (var i = 0; i < 10; i++) {
        // 始めの10個分を読む
        headerHex += ba[i].toString(16); // 16進文字列で読む
        headerStr += String.fromCharCode(ba[i]); // 文字列で読む
      }
      var fileType = "unknown";
      if (headerHex.indexOf("ffd8") != -1) {
        // JPGはヘッダーに「ffd8」を含む
        fileType = "JPG";
      } else if (headerStr.indexOf("PNG") != -1) {
        // PNGはヘッダーに「PNG」を含む
        fileType = "PNG";
      } else if (headerStr.indexOf("GIF") != -1) {
        // GIFはヘッダーに「GIF」を含む
        fileType = "GIF";
      } else if (headerStr.indexOf("BM") != -1) {
        // BMPはヘッダーに「BM」を含む
        fileType = "BMP";
      }
      console.log("fileType=" + fileType + " headerStr=" + headerStr + " headerHex=" + headerHex);
      return fileType;
    }, //END getImageFileType()
  },
};
</script>

<style lang="scss" scoped>
</style>
