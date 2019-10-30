import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import todobox from './todobox.js'

export default new Vuex.Store({
  plugins: [],
  modules: {
    todobox
  }
})
