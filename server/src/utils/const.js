const OKEX_ENDPOINT = 'https://www.okex.com/api/market/v3/oracle'

const OPEN_ORACLE_DEPS = {
  outPoint: { txHash: '0xdbed1ab475285d29c451cb6c8f7e0d73a771f3bb9cc4a20fa15acbced9fd8384', index: '0x0' },
  depType: 'code',
}

const OKEX_ORACLE_LOCK = {
  codeHash: '0x3a7b00b74ef24c93967ad9e933d4c12eb54c4f87f20c11d9a5ae4e10267e2444',
  hashType: 'type',
  args: '0x85615b076615317c80f14cbad6501eec031cd51c',
}

const BAND_ORACLE_LOCK = {
  codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  hashType: 'type',
  args: '0x32bac9e840673c165631f388039f62d97c437f04',
}

const BAND_SYMBOL = '62616e64' // Hex of "band"
const BAND_TOKENS = ['BTC', 'ETH', 'DAI', 'REP', 'ZRX', 'BAT', 'KNC', 'LINK', 'COMP', 'BAND']
const DATABASE_TOKENS = BAND_TOKENS.concat('CKB')

module.exports = {
  OKEX_ENDPOINT,
  OPEN_ORACLE_DEPS,
  BAND_SYMBOL,
  OKEX_ORACLE_LOCK,
  BAND_ORACLE_LOCK,
  BAND_TOKENS,
  DATABASE_TOKENS,
}
