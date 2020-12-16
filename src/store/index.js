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

    /** **データをどこから読み込むかのフラグ**
     * キャッシュから読み取りたい場合はここでフラグ管理する
     * 初回はサーバ get({ source: "server" })
     * 初回以降はキャッシュ get({ source: "cache" })
     */
    sourceFromCache: {
      battleRecords: false,
      battleRecords4: false,
    },
  },
  mutations: {
    // Firebase参照の保存
    setAuth (state, payload) {
      state.auth = payload.auth;
    },
    setDb (state, payload) {
      state.db = payload.db;
    },

    // ユーザデータをセットする
    setUser (state, payload) {
      state.currentUser = { ...payload };
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
    },

    // データソースを変更する
    triedFromServer (state, payload) {
      state.sourceFromCache[payload.key] = true;
    }
  },
  // actions: {
  // },
  // modules: {
  // },
  // getters: {
  // },
})
