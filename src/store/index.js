import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    theme: "chalk",
    socket_connected: false,
  },
  getters: {},
  mutations: {
    changeTheme(state) {
      if (state.theme === "chalk") {
        state.theme = "vintage";
      } else {
        state.theme = "chalk";
      }
      console.log("theme", state.theme);
    },
    setSocketConnected(state, value) {
      state.socket_connected = value;
    },
  },
  actions: {},
  modules: {},
});
