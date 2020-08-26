import Vue from 'vue'
import VeCandle from 'v-charts/lib/candle.common'
import App from './App.vue'
import router from './router'

Vue.component(VeCandle.name, VeCandle)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
