const TokenInfoData = [
  {
    token: 'BTC/USDT',
    price: '11979.80',
    from: 'Coinbase',
    timestamp: '3min ago',
    change: '12.45%',
    icon: 'btc.png',
  },
  {
    token: 'ETH/USDT',
    price: '399.80',
    from: 'Coinbase',
    timestamp: '3min ago',
    change: '12.45%',
    icon: 'eth.png',
  },
  {
    token: 'CKB/USDT',
    price: '0.569',
    from: 'Coinbase',
    timestamp: '3min ago',
    change: '17.9%',
    icon: 'ckb.png',
  },
]

const HistoryPriceData = [
  {
    token: 'BTC/USDT',
    price: '11979.80',
    timestamp: '1597093527000',
  },
  {
    token: 'BTC/USDT',
    price: '12045.80',
    timestamp: '1597103527000',
  },
  {
    token: 'BTC/USDT',
    price: '11709.47',
    timestamp: '1597123527000',
  },
  {
    token: 'BTC/USDT',
    price: '11589.47',
    timestamp: '1597143527000',
  },
  {
    token: 'BTC/USDT',
    price: '11909.47',
    timestamp: '1597193527000',
  },
]

const TokenDetailData = {
  source: {
    txHash: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    sender: '0xF79D6aFBb6dA890132F9D7c355e3015f15F3406F',
    timestamp: '1597113527000',
  },
  destination: {
    txHash: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    block: '234580',
    timestamp: '1597193527000',
  },
}

module.exports = {
  TokenInfoData,
  HistoryPriceData,
  TokenDetailData,
}
