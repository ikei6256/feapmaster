<template>
  <v-card :color="card_color">
    <v-card-title class="card-playerInfo">
      <v-avatar class="playerPhoto mr-1 mr-sm-2" color="#fff">
        <v-img :src="playerData.photoURL" alt="Player Photo" />
      </v-avatar>
      <span class="playerName">{{ playerData.name }}</span>
      <div class="playerStatus">
        <transition name="fade">
          <div v-show="isShowPlayerStatus">
            <transition mode="out-in">
              <span v-if="playerData.status === 'selecting'" class="selecting" key="selecting">選択中...</span>
              <svg v-else-if="playerData.status === 'waiting'" class="animated-check" viewBox="0 0 24 24" key="waiting">
                <path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" />
              </svg>
              <span v-else-if="playerData.status === 'timeup'" key="timeup" class="grey--text text--darken-3">時間切れ</span>
              <span v-else-if="!MODE_4PLAYERS &&  playerData.status === 'win'" key="win" class="red--text">WIN</span>
              <span v-else-if="!MODE_4PLAYERS && playerData.status === 'lose'" key="lose" class="blue--text">LOSE</span>
              <span v-else-if="!MODE_4PLAYERS && playerData.status === 'draw'" key="draw" class="green--text">DRAW</span>
              <span v-else-if="MODE_4PLAYERS && playerData.status === 'showRank'" key="rank">{{ playerData.rank_final }}位</span>
              <span v-else-if="playerData.status === 'error'" key="error" class="grey--text text--darken-2">接続エラー</span>
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
    card_color: String,
    MODE_4PLAYERS: Boolean,
  },
  watch: {
    "playerData.status": function (val) {
      const selecting = document.getElementsByClassName("selecting")[0];
      if (selecting) {
        if (val === "selecting") {
          selecting.classList.add("blink");
        } else {
          selecting.classList.remove("blink");
        }
      }
    },
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
    letter-spacing: 0.01rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; //「...」の表示
    text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
    line-height: normal; // 絵文字に対応するため
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

/*** 「選択中」の点滅 ***/
.blink {
  animation: blink 2s linear infinite;

  @keyframes blink {
    0%,
    40%,
    100% {
      opacity: 1;
    }

    20% {
      opacity: 0;
    }
  }
}

/*** チェックマーク ***/
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
