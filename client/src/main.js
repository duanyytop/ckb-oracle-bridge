import Vue from 'vue'
import VeLine from 'v-charts/lib/line.common'
import App from './App.vue'
import router from './router'

Vue.component(VeLine.name, VeLine)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
