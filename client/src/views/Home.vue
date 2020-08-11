<template>
  <div class="home">
    <div class="list">
      <div v-for="tokenInfo in tokenInfoList" :key="tokenInfo.token">
        <TokenPrice :tokenInfo="tokenInfo" />
      </div>
    </div>
  </div>
</template>

<script>
import TokenPrice from '@/components/TokenPrice.vue'
import { TokenInfoData } from '../mock/index'

export default {
  name: 'Home',
  components: {
    TokenPrice,
  },
  data: function() {
    return {
      tokenInfoList: TokenInfoData,
    }
  },
}
</script>

<style lang="scss" scoped>
.list {
  margin-top: 30px;
}
</style>
