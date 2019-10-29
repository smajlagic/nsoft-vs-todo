import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) },
  filters: {
    sortTodos: function(value) {
      return value.slice().reverse();
    }
  }
}).$mount('#app')





