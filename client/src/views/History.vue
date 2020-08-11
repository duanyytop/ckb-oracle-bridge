<template>
  <div class="history">
    <div class="title">{{ parseToken(token) }}</div>
    <ve-line
      :data="chartData"
      :legend-visible="false"
      :grid="{ top: '10%', bottom: '10%' }"
      :yAxis="{ scale: 'true' }"
      :colors="['#ff0000']"
      height="280px"
    ></ve-line>
    <div class="list">
      <div v-for="historyPrice in historyPriceList" :key="historyPrice.price">
        <HistoryPrice :historyPrice="historyPrice" />
      </div>
    </div>
  </div>
</template>

<script>
import HistoryPrice from '@/components/HistoryPrice.vue'
import { HistoryPriceData } from '../mock/index'
import { parseDate, parseToUpperCase } from '../utils/index'

export default {
  name: 'History',
  props: ['token'],
  components: {
    HistoryPrice,
  },
  data: function() {
    return {
      historyPriceList: HistoryPriceData,
      chartData: {
        columns: ['date', 'price'],
        rows: HistoryPriceData.map(data => {
          return {
            date: parseDate(data.timestamp),
            price: data.price,
          }
        }),
      },
    }
  },
  methods: {
    parseToken: function() {
      return parseToUpperCase(this.token)
    },
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
</style>
