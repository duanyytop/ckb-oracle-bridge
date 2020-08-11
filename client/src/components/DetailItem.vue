<template>
  <div class="item">
    <div>{{ item.label }}:</div>
    <a class="value" v-if="item.link" :href="item.link" target="_blank">{{ item.value }}</a>
    <div class="value" v-else>{{ item.value }}</div>
  </div>
</template>

<script>
export default {
  name: 'DetailItem',
  props: ['item'],
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;

  @media screen and (min-width: 750px) {
    flex-direction: row;
  }

  div:first-child {
    font-size: 16px;
    color: #333333;
    font-weight: 600;
  }

  .value {
    font-size: 16px;
    color: black;
    word-wrap: break-word;
  }

  a {
    color: blue !important;
    font-family: monospace;
    text-decoration: none;
    font-size: 16px;
  }
}
</style>
