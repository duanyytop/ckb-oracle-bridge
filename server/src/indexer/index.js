const { Indexer } = require('@ckb-lumos/indexer')
const CKB = require('@nervosnetwork/ckb-sdk-core').default
const { CKB_NODE_URL } = require('../utils/config')

const ckb = new CKB(CKB_NODE_URL)
const indexer = new Indexer(CKB_NODE_URL, './src/indexed-data')

const startIndexer = () => {
  indexer.startForever()
}

const isIndexerTip = async () => {
  const blockNumber = (await indexer.tip()).block_number
  const tipNumber = await ckb.rpc.getTipBlockNumber()
  console.info(`indexer tip number: ${blockNumber} --- ckb node tip number: ${tipNumber}`)
  return blockNumber === tipNumber
}

module.exports = {
  indexer,
  startIndexer,
  isIndexerTip,
}
