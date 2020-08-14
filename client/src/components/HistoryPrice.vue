<template>
  <div class="container">
    <div class="item" @click.prevent="handleClick()">
      <div>{{ historyPrice.price }}</div>
      <div>{{ parseDateTime(historyPrice.timestamp) }}</div>
    </div>
    <div class="separator" />
  </div>
</template>

<script>
import { parseTime } from '../utils/index'

export default {
  name: 'HistoryPrice',
  props: ['historyPrice'],
  methods: {
    handleClick: function() {
      this.$router.push(`/detail/${this.historyPrice.token}/${this.historyPrice.timestamp}`)
    },
    parseDateTime: function(timestamp) {
      return parseTime(timestamp)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 8px 16px;
}

.item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;

  &:hover {
    background: #ededed;
  }

  div:first-child {
    font-size: 16px;
    color: black;
    font-weight: 600;
  }

  div:last-child {
    font-size: 14px;
    color: black;
  }
}

.separator {
  background: #ececec;
  width: 100%;
  height: 1px;
}
</style>
