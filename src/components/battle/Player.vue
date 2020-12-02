<template>
  <v-card color="teal lighten-5">
    <v-card-title class="card-playerInfo">
      <v-avatar class="playerPhoto mr-1 mr-sm-2" color="#fff">
        <img :src="playerData.photoURL" alt="Player" />
      </v-avatar>
      <span class="playerName">{{ playerData.name }}</span>
      <div class="playerStatus">
        <transition name="fade">
          <div v-show="isShowPlayerStatus">
            <transition mode="out-in">
              <span v-if="playerData.status === 'selecting'" class="blink" key="selecting"> 選択中... </span>
              <svg v-if="playerData.status === 'waiting'" class="animated-check" viewBox="0 0 24 24" key="waiting">
                <path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" />
              </svg>
              <span v-if="playerData.status === 'timeup'" key="timeup">時間切れ</span>
              <span v-if="playerData.status === 'win'" key="win">WIN</span>
              <span v-if="playerData.status === 'lose'" key="lose">LOSE</span>
              <span v-if="playerData.status === 'draw'" key="draw">DRAW</span>
              <span v-if="playerData.status === 'error'" key="error">接続エラー</span>
            </transition>
          </div>
        </transition>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <div class="score text-center pb-2 pb-sm-4">
      <span class="score-text berlin-sans">SCORE</span>
      <span class="points pacifico">{{ playerData.score }}</span>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    playerData: Object, // プレイヤーデータ
    isShowPlayerStatus: Boolean, // プレイヤーの状態を表示するタイミングを制御する
  },
};
</script>

<style lang="scss" scoped>
.card-playerInfo {
  display: grid;
  grid-template:
    "userPhoto name" 1fr
    "userPhoto status" 1fr
    / auto 1fr;

  .playerPhoto {
    grid-area: userPhoto;
  }

  .playerName {
    grid-area: name;
    font-size: 0.875rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .playerStatus {
    grid-area: status;
    font-size: 0.75rem;
  }
}

.score {
  position: relative;

  .score-text {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    font-size: 0.8rem;
    color: #9e9e9e;
  }

  .points {
    font-size: 5.5rem;
  }
}

/* --------------------
 * チェックマーク
 * -------------------- */
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
</style>
