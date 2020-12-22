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
      myLists: false,
      myListsAP: false,
      battleRecords: false,
      battleRecords4: false,
    },
  },
  mutations: {
    /** ユーザデータをセットする */
    setUser (state, payload) {
      state.currentUser = { ...payload };
    },
    /** ユーザ画像を設定する */
    setUserPhoto (state, payload) {
      state.currentUser.photoURL = payload.photoURL;
    },
    /** ユーザ名を設定する */
    setUserName (state, payload) {
      state.currentUser.name = payload.name;
    },
    /** ユーザメールを設定する */
    setUserEmail (state, payload) {
      state.currentUser.email = payload.email;
    },

    /** ユーザデータをクリア */
    unsetUser (state) {
      state.currentUser = null;
    },

    /** ステータス変更: 対戦中 */
    stateBattleTrue (state) {
      state.isPlaying = true;
    },
    /** ステータス変更: 対戦中ではない */
    stateBattleFalse (state) {
      state.isPlaying = false;
    },

    /** キャッシュフラグを変更 */
    cacheServerData (state, data) {
      state.sourceFromCache[data] = true;
    }
  },
  // actions: {
  // },
  // modules: {
  // },
  // getters: {
  // },
})
