<template>
  <div>
    <div class="name mb-1">{{ playerData.name }}</div>
    <div>
      <img :src="playerData.photoUrl" class="playerPhoto" alt="プレイヤーイメージ" />
    </div>
    <div class="playerStatus">
      <transition name="fade">
        <div v-show="isShowPlayerStatus">
          <!-- selecting | waiting | timeup -->
          <transition mode="out-in">
            <span v-if="playerData.status === 'selecting'" class="text-muted blink" key="selecting"> 選択中... </span>
            <!-- (Draw a check mark CSS animation from left down to right up | stackoverflow)[https://stackoverflow.com/questions/26558916] -->
            <svg v-if="playerData.status === 'waiting'" class="animated-check" viewBox="0 0 24 24" key="waiting">
              <path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" />
            </svg>
            <span v-if="playerData.status === 'timeup'" class="text-danger" key="timeup">時間切れ</span>
            <span v-if="playerData.status === 'win'" class="text-danger" key="win">WIN</span>
            <span v-if="playerData.status === 'lose'" class="text-secondary" key="lose">LOSE</span>
            <span v-if="playerData.status === 'draw'" class="text-success" key="draw">DRAW</span>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playerData: Object, // プレイヤーデータ
    isShowPlayerStatus: Boolean, // プレイヤーの状態を表示するタイミングを制御する
  },
  mounted() {
    console.log("--- Player: mounted ---");
    this.$emit("blink"); // 「選択中」の点滅を発生させる
  },
};
</script>

<style lang="scss" scoped>
.name {
  font-weight: bold;
}
.playerPhoto {
  height: 10vh;
}
.playerStatus {
  height: 1.5rem;
}
/* Start: チェックマーク */
.animated-check {
  height: 1em;
  width: 1em;
  path {
    fill: none;
    stroke: #7ac142;
    stroke-width: 4;
    stroke-dasharray: 23;
    stroke-dashoffset: 23;
    animation: draw 0.15s linear forwards;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }
}
/* End: チェックマーク */
</style>
