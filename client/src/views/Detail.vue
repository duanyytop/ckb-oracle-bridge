<template>
  <div class="detail">
    <div class="title">{{ parseToken() }}</div>
    <div class="sub">Oracle</div>
    <div v-for="item in detail.oracle" :key="'source' + item.label.trim()">
      <DetailItem :item="item" />
    </div>
    <div class="sub">Destination</div>
    <div v-for="item in detail.destination" :key="'destination' + item.label.trim()">
      <DetailItem :item="item" />
    </div>
  </div>
</template>

<script>
import DetailItem from '@/components/DetailItem.vue'
import { parseTime, parseUpperToken } from '../utils/index'
import { fetchTokenDetail } from '../service/index'

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
    fetchTokenDetail(this.token, this.timestamp).then(res => {
      this.parseDetail(res)
    })
  },
  methods: {
    parseDetail: function(detail) {
      const { token, price, timestamp, destination, from } = detail
      this.detail = {
        oracle: [
          {
            label: 'Token',
            value: parseUpperToken(this.token),
          },
          {
            label: 'Price',
            value: price,
          },
          {
            label: 'From',
            value: from,
          },
          {
            label: 'Timestamp',
            value: `${timestamp} (${parseTime(timestamp)})`,
          },
        ],
        destination: [
          {
            label: 'Tx Hash',
            value: destination.tx_hash,
            link: this.ckbTxLink(destination.tx_hash),
          },
          {
            label: 'Block',
            value: parseInt(destination.block_number),
            link: this.ckbBlockLink(parseInt(destination.block_number)),
          },
          {
            label: 'Timestamp',
            value: `${parseInt(destination.timestamp)} (${parseTime(destination.timestamp, false)})`,
          },
        ],
      }
    },
    ckbTxLink: function(tx) {
      return `https://explorer.nervos.org/aggron/transaction/${tx}`
    },
    ckbBlockLink: function(block) {
      return `https://explorer.nervos.org/aggron/block/${block}`
    },
    parseToken: function() {
      return parseUpperToken(this.token)
    },
  },
}
</script>

<style lang="scss" scoped>
.detail {
  padding: 8px 16px;

  .title {
    width: 100%;
    text-align: center;
    font-size: 24px;
    color: black;
    font-weight: 600;
    padding-top: 16px;
  }

  .sub {
    font-size: 24px;
    color: white;
    font-weight: 600;
    margin-top: 24px;
    background: red;
    padding-left: 8px;
    height: 40px;
    line-height: 40px;
  }
}
</style>
