const OKEX_ORACLE_LOCK = {
  codeHash: '0x224fe274a7b005cd299f7223afa8ab4be24d0d754cf9655dfa3a4cb497f0f32b',
  hashType: 'type',
  args: '0x85615b076615317c80f14cbad6501eec031cd51c',
}

const BAND_ORACLE_LOCK = {
  codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  hashType: 'type',
  args: '0x629a817d8b8410297efb864e6e1cc4487649dbec',
}

const BAND_SYMBOL = '62616e64' // Hex of "band"

const ORACLE_SOURCES = ['band', 'okex']

const INDEXER_TX_COUNT = 50

const BAND_CONFIG = {
  ask_count: 16,
  min_count: 10,
  endpoint: 'http://guanyu-testnet3-query.bandchain.org',
}

module.exports = {
  BAND_CONFIG,
  BAND_SYMBOL,
  OKEX_ORACLE_LOCK,
  BAND_ORACLE_LOCK,
  ORACLE_SOURCES,
  INDEXER_TX_COUNT,
}
