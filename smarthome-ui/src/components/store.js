import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    isLoggedIn: !!localStorage.getItem('smarthomeUser')
  },
  mutations: {
    setLoggedIn (state, logged) {
      state.isLoggedIn = logged
    }
  }
})
