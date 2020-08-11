<template>
  <div class="history">
    <ve-line :data="chartData" :legend-visible="false" :grid="{ top: '12%', bottom: '3%' }" height="300px"></ve-line>
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
import { parseDate } from '../utils/index'

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
}
</script>

<style lang="scss" scoped>
.list {
  margin-top: 30px;
}
</style>
