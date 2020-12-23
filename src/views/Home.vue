<template>
  <div class="home">
    <div class="logo px-1 px-md-0">
      <img src="/img/logo/logo.png" alt="FE AP Master" />
    </div>
    <div class="select">
      <div class="links-battle">

        <div class="wrap-battle2">
          <div class="battle2">
            <router-link :to="{ name: 'Battle' }">
              <v-btn text color="primary">
                <span class="link-battle berlin-sans">Battle<span class="detail ml-1">[2P]</span></span>
              </v-btn>
            </router-link>
          </div>
          <!-- <div class="battle2_input">
            <router-link :to="{ name: 'Battle' }">
              <v-btn text color="primary">
                <span class="input_room">ルーム入力</span>
              </v-btn>
            </router-link>
          </div> -->
        </div>

        <div class="wrap-battle4">
          <div class="battle4">
            <router-link :to="{ name: 'Battle4' }">
              <v-btn text color="pink darken-1">
                <span class="link-battle berlin-sans">Battle<span class="detail ml-1">[4P]</span></span>
              </v-btn>
            </router-link>
          </div>
          <!-- <div class="battle4_input">
            <router-link :to="{ name: 'Battle4' }">
              <v-btn text color="pink darken-1" disabled>
                <span class="input_room">ルーム入力</span>
              </v-btn>
            </router-link>
          </div> -->
        </div>
      </div>

      <div class="links-ext mt-16 text-center">
        <p>
          <v-btn class="external-btn" color="primary" href="https://feapmaster-mobile.web.app" target="_blank" text disabled style="text-decoration:line-through">
            Flutter for Web お試し版<v-icon class="external-icon ml-1">{{ icons.mdiOpenInNew }}</v-icon>
          </v-btn>
        </p>
        <p>
          <v-btn class="external-btn" color="primary" href="https://forms.gle/PLe5syon4VmYAZ7G8" target="_blank" text
            >ご意見・ご要望<v-icon class="external-icon ml-1">{{ icons.mdiOpenInNew }}</v-icon></v-btn
          >
        </p>
      </div>
    </div>

    <v-footer class="home-footer py-0 px-1 px-md-0" style="background-color: inherit">
      <div class="left">
        <a class="logo-firebase" href="https://firebase.google.com" target="_blank">
          <img src="/img/logo/Built_with_Firebase_Logo_Light.png" alt="Firebase" />
        </a>
        <a class="logo-github" href="https://github.com/ikei6256/feapmaster" target="_blank">
          <img src="/img/logo/GitHub-Mark-64px.png" alt="GitHub" />
        </a>
      </div>
      <span class="copyright">&copy; <span class="berlin-sans">FEAPMaster</span> 開発チーム</span>
    </v-footer>
  </div>
</template>

<script>
import { mdiOpenInNew } from "@mdi/js";
export default {
  data() {
    return {
      icons: {
        mdiOpenInNew: mdiOpenInNew,
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  grid-template:
    "..." 0.15fr
    "logo"
    "..." 0.15fr
    "nav" 1fr
    "..." 0.15fr
    "footer"
    "..." 1rem;
}

.logo {
  grid-area: logo;
  text-align: center;

  img {
    max-height: 100%;
    max-width: 100%;
  }
}

/*********************
 * ナビゲーション
 *********************/
.select {
  grid-area: nav;

  .links-battle {
    .v-btn {
      height: 3rem;
      text-transform: none;
    }
    .link-battle {
      font-size: 2.75rem;
      text-shadow: 0.5px 0.5px 1px #636ab2;

      .detail {
        font-size: 1.2rem;
        font-weight: bold;
      }
    }

    .wrap-battle2, .wrap-battle4 {
      display: flex;
      justify-content: center;
    }
    .wrap-battle4 {
      margin-top: 1.5rem;
    }

    // @media screen and (min-width: 600px) {
    //   display: grid;
    //   grid-template:
    //     "battle2 ... battle4"
    //     / auto 5rem auto;

    //   .wrap-battle2, .wrap-battle4 {
    //     // リセット
    //     display: block;
    //     justify-content: normal;
    //   }
    //   .wrap-battle2 {
    //     grid-area: battle2;
    //     justify-self: right;
    //     text-align: center;
    //   }
    //   .wrap-battle4 {
    //     // リセット
    //     margin: 0;

    //     // ここから
    //     grid-area: battle4;
    //     justify-self: left;
    //     text-align: center;
    //   }
    //   .wrap-battle2 .battle2,
    //   .wrap-battle4 .battle4 {
    //     margin-bottom: 0.5rem;
    //   }
    // }
  }

  .links-ext {
    .v-btn {
      text-transform: none;
    }
    .external-btn,
    .external-icon {
      font-size: 0.9rem;
    }
    .external-icon {
      height: 0.9rem;
      width: 0.9rem;
    }
  }
}

// Footer
$footer-height: 3rem;
.home-footer {
  grid-area: footer;
  display: grid;
  align-items: center;
  grid-template: "left copy" $footer-height;
}
.left {
  grid-area: left;
  display: grid;
  grid-template:
    "firebase ... github ..."
    / auto 0.5rem auto 1fr;

  .logo-firebase {
    grid-area: firebase;
    img {
      max-height: $footer-height;
    }
  }

  .logo-github {
    grid-area: github;
    display: table-cell;
    height: $footer-height;
    line-height: $footer-height;
    width: $footer-height;
    text-align: center;
    border-radius: 2px;
    img {
      max-height: $footer-height - 0.3rem;
      max-width: $footer-height - 0.3rem;
      vertical-align: middle;
    }
  }
}
.copyright {
  grid-area: copy;
  justify-self: right;
  font-size: 0.8rem;
  color: rgb(90, 90, 90);
}
</style>
