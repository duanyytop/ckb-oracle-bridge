<template>
  <div class="history">
    <h2>{{ token }}</h2>
    <div class="list">
      <div v-for="historyPrice in historyPriceList" :key="historyPrice.timestamp">
        <HistoryPrice :historyPrice="historyPrice" />
      </div>
    </div>
  </div>
</template>

<script>
import HistoryPrice from '@/components/HistoryPrice.vue'
import { HistoryPriceData } from '../mock/prices'

export default {
  name: 'History',
  props: ['token'],
  components: {
    HistoryPrice,
  },
  data: function() {
    return {
      historyPriceList: HistoryPriceData,
    }
  },
}
</script>

<style lang="scss" scoped>
.list {
  margin-top: 30px;
}
</style>
