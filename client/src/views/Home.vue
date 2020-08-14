<template>
  <div class="home">
    <div class="list">
      <div v-for="tokenInfo in tokenInfoList" :key="tokenInfo.token + tokenInfo.timestamp">
        <TokenPrice :tokenInfo="tokenInfo" />
      </div>
    </div>
  </div>
</template>

<script>
import TokenPrice from '@/components/TokenPrice.vue'
import { fetchAllTokenList } from '../service/index'

export default {
  name: 'Home',
  components: {
    TokenPrice,
  },
  data: function() {
    return {
      tokenInfoList: [],
    }
  },
  mounted: function() {
    fetchAllTokenList().then(res => (this.tokenInfoList = res))
  },
}
</script>

<style lang="scss" scoped>
.list {
  margin-top: 30px;
}
</style>
