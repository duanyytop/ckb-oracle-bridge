<template>
  <div class="container">
    <div class="item">
      <div>{{ historyPrice.price }}</div>
      <div>{{ historyPrice.timestamp }}</div>
    </div>
    <div class="separator" />
  </div>
</template>

<script>
export default {
  name: 'HistoryPrice',
  props: ['historyPrice'],
}
</script>

<style lang="scss" scoped>
.container {
  padding: 8px 16px;
}

.item {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
}

.separator {
  background: #ececec;
  width: 100%;
  height: 1px;
}
</style>
