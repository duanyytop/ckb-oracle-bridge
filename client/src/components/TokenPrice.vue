<template>
  <div class="container" v-if="tokenInfo.token">
    <div class="item" @click.prevent="handleClick()">
      <div class="left">
        <img
          v-bind:src="require('../assets/' + tokenInfo.token.toLowerCase() + '.png')"
          :alt="tokenInfo.token"
        />
        <div class="token">
          <div>{{ parseToken() }}</div>
          <div>{{ tokenInfo.from }}</div>
        </div>
      </div>
      <div class="right">
        <div class="price">
          <div>{{ tokenInfo.price }}</div>
          <div>{{ parseDateTime() }}</div>
        </div>
        <div class="change" v-bind:class="{ negative: isNegative() }">{{ tokenInfo.change }}</div>
      </div>
    </div>
    <div class="separator" />
  </div>
  <div v-else>{{ tokenInfo }}</div>
</template>

<script>
import { parseTime } from '../utils/index'
export default {
  name: 'TokenPrice',
  props: ['tokenInfo'],
  methods: {
    handleClick: function() {
      this.$router.push(`/history/${this.tokenInfo.source}/${this.tokenInfo.token.toLowerCase()}`)
    },

    parseToken: function() {
      return `${this.tokenInfo.token.toUpperCase()}/USDT`
    },

    parseDateTime: function() {
      return parseTime(this.tokenInfo.timestamp)
    },

    isNegative: function() {
      return this.tokenInfo.change.startsWith('-')
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
  padding-bottom: 8px;
}

.left {
  display: flex;
  flex: 1;
}

.right {
  display: flex;
  flex: 1.2;
  justify-content: space-between;
}

.token {
  margin-left: 8px;

  div:first-child {
    font-size: 16px;
    font-weight: 600;
  }

  div:last-child {
    margin-top: 5px;
    font-size: 14px;
    text-align: left;
  }
}

.price {
  div:first-child {
    font-size: 16px;
    font-weight: 600;
    text-align: left;
  }

  div:last-child {
    margin-top: 5px;
    font-size: 14px;
    text-align: left;

    @media screen and (max-width: 750px) {
      font-size: 12px;
    }
  }
}

.change {
  margin-left: 6px;
  font-size: 14px;
  background: green;
  color: white;
  height: 30px;
  line-height: 30px;
  font-weight: 600;
  min-width: 65px;
  text-align: center;
  border-radius: 6px;
}

.negative {
  background: red;
}

img {
  width: 28px;
  height: 28px;
}

.separator {
  background: #ececec;
  width: 100%;
  height: 1px;
}
</style>
