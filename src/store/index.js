import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '../firebase';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: firebase.auth(), // 認証情報
    currentUser: null, // ユーザの情報をローカルに保存する
    db: firebase.firestore(), // Firestoreへの参照
    isPlaying: false, // 対戦中かどうか
  },
  mutations: {
    // Firebase参照の保存
    setAuth (state, payload) {
      state.auth = payload.auth;
    },
    setDb (state, payload) {
      state.db = payload.db;
    },

    // currentUserにデータをセットする
    setUser (state, payload) {
      state.currentUser = {
        name: payload.name,
        email: payload.email,
        photoURL: payload.photoURL,
        uid: payload.uid,
        level: payload.level
      }
    },
    unsetUser (state) {
      state.currentUser = null;
    },

    // 対戦中か否か
    stateBattleTrue (state) {
      state.isPlaying = true;
    },
    stateBattleFalse (state) {
      state.isPlaying = false;
    }
  },
  // actions: {
  // },
  // modules: {
  // },
  // getters: {
  // },
})
