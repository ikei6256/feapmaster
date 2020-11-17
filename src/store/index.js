import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '../firebase';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    TIMER_DEFAULT: 150, // 基本タイム 150
    timer_valuenow: null,
    auth: firebase.auth(), // 認証情報
    db: firebase.firestore(), // Firestoreへの参照
  },
  mutations: {
    timer_countdown(state) {
      state.timer_valuenow--;
    },
    setTimer(state, payload = { time: state.TIMER_DEFAULT }) {
      state.timer_valuenow = payload.time;
    },
    setAuth(state, payload) {
      state.auth = payload.auth;
    },
    setDb(state, payload) {
      state.db = payload.db;
    },
  },
  // actions: {
  // },
  // modules: {
  // },
  getters: {
    getTimerPercentage(state) {
      return state.timer_valuenow / state.TIMER_DEFAULT * 100;
    }
  }
})
