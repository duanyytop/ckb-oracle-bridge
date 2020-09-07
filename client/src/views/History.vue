<template>
  <div class="history">
    <div class="title">{{ parseToken(token) }}</div>
    <ve-candle
      :data="chartData"
      :settings="chartSettings"
      :tooltip-visible="false"
      height="280px"
      with="90%"
    />
    <div class="list">
      <div v-for="historyPrice in historyPriceList" :key="historyPrice.timestamp">
        <HistoryPrice :historyPrice="historyPrice" />
      </div>
    </div>
  </div>
</template>

<script>
import HistoryPrice from '@/components/HistoryPrice.vue'
import { parseDate, parseUpperToken } from '../utils/index'
import { fetchHistoryWithToken } from '../service/index'

export default {
  name: 'History',
  props: ['source', 'token'],
  components: {
    HistoryPrice,
  },
  data: function() {
    return {
      historyPriceList: [],
      chartData: {
        columns: ['date', 'price'],
        rows: [],
      },
      chartSettings: {
        legendName: {
          日K: 'Hour K',
        },
      },
    }
  },
  methods: {
    parseToken: function() {
      return parseUpperToken(this.token)
    },
    handleChartData: function(list) {
      const maxHour = Math.ceil(parseInt(list[0].timestamp) / 3600) * 3600
      const minHour = Math.ceil(parseInt(list[list.length - 1].timestamp) / 3600) * 3600
      const newList = list.filter(item => parseInt(item.timestamp) >= minHour && parseInt(item.timestamp) <= maxHour).reverse()
      let count = Math.ceil((maxHour - minHour) / 3600)
      let chartList = []
      for (let index = 0; index < count; index++) {
        const firstTimestamp = minHour + index * 3600 - 300
        const lastTimestamp = minHour + (index + 1) * 3600
        const sub = newList
          .filter(item => parseInt(item.timestamp) >= firstTimestamp && parseInt(item.timestamp) <= lastTimestamp)
          .map(item => item.price)
        chartList.push({
          date: parseDate(firstTimestamp + 300),
          open: sub[0],
          close: sub[sub.length - 1],
          highest: Math.max(...sub),
          lowest: Math.min(...sub),
        })
      }
      return chartList
    },
  },
  mounted: function() {
    fetchHistoryWithToken(this.source, this.token).then(res => {
      this.historyPriceList = res.slice(0, 30)
      this.chartData = {
        ...this.chartData,
        columns: ['date', 'open', 'close', 'highest', 'lowest'],
        rows: this.handleChartData(res),
      }
    })
  },
}
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  text-align: center;
  font-size: 24px;
  color: black;
  font-weight: 600;
  padding-top: 16px;
}
.list {
  margin-top: -30px;
}
</style>
