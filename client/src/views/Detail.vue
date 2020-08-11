<template>
  <div class="detail">
    <div class="title">Source</div>
    <div v-for="item in detail.source" :key="'source' + item.label.trim()">
      <DetailItem :item="item" />
    </div>
    <div class="title">Destination</div>
    <div v-for="item in detail.destination" :key="'destination' + item.label.trim()">
      <DetailItem :item="item" />
    </div>
  </div>
</template>

<script>
import DetailItem from '@/components/DetailItem.vue'
import { TokenDetailData } from '../mock/index'
import { parseTime } from '../utils/index'

export default {
  name: 'History',
  components: {
    DetailItem,
  },
  props: ['token', 'timestamp'],
  data: function() {
    return {
      detail: {
        source: [],
        destination: [],
      },
    }
  },
  mounted: function() {
    this.parseDetail()
  },
  methods: {
    parseDetail: function() {
      const { source, destination } = TokenDetailData
      this.detail = {
        source: [
          {
            label: 'Tx Hash',
            value: source.txHash,
            link: this.ethTxLink(source.txHash),
          },
          {
            label: 'Sender',
            value: source.sender,
            link: this.ethAddressLink(source.sender),
          },
          {
            label: 'Timestamp',
            value: `${source.timestamp} (${parseTime(source.timestamp)})`,
          },
        ],
        destination: [
          {
            label: 'Tx Hash',
            value: destination.txHash,
            link: this.ckbTxLink(destination.txHash),
          },
          {
            label: 'Block',
            value: destination.block,
            link: this.ckbBlockLink(destination.block),
          },
          {
            label: 'Timestamp',
            value: `${destination.timestamp} (${parseTime(destination.timestamp)})`,
          },
        ],
      }
    },
    ethTxLink: function(tx) {
      return `https://etherscan.io/tx/${tx}`
    },
    ethAddressLink: function(address) {
      return `https://etherscan.io/address/${address}`
    },
    ckbTxLink: function(tx) {
      return `https://explorer.nervos.org/transaction/${tx}`
    },
    ckbBlockLink: function(block) {
      return `https://explorer.nervos.org/block/${block}`
    },
  },
}
</script>

<style lang="scss" scoped>
.detail {
  padding: 8px 16px;

  .title {
    font-size: 24px;
    color: black;
    font-weight: 600;
    margin-top: 16px;
  }
}
</style>
