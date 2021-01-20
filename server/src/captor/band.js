const CKB = require('@nervosnetwork/ckb-sdk-core').default
const { TransactionCollector } = require('@ckb-lumos/indexer')
const { indexer } = require('../indexer/index')
const { CKB_NODE_URL } = require('../utils/config')
const { parseBandData, parseBandPrice, fetchSymbols } = require('../utils')
const { BAND_ORACLE_LOCK, BAND_SYMBOL } = require('../utils/const')

const ckb = new CKB(CKB_NODE_URL)

const collectTransactions = async toBlock => {
  let toBlockNumber = parseInt(toBlock, 16)
  let fromBlock = toBlockNumber > 100 ? `0x${(toBlockNumber - 100).toString(16)}` : '0x0'
  const collector = new TransactionCollector(indexer, {
    lock: {
      code_hash: BAND_ORACLE_LOCK.codeHash,
      hash_type: BAND_ORACLE_LOCK.hashType,
      args: BAND_ORACLE_LOCK.args,
    },
    fromBlock,
    toBlock,
    order: 'desc',
  })
  console.info(`Band fromBlock: ${fromBlock} --- toBlock: ${toBlock}`)
  const transactions = []
  for await (const transaction of collector.collect()) {
    let outputsData = transaction.transaction.outputs_data
    if (outputsData.length <= 1 || !outputsData[0].startsWith(`0x${BAND_SYMBOL}`)) {
      continue
    }
    transactions.push(transaction)
  }
  return transactions
}

const parseTokenInfo = async (transaction, data) => {
  const block = await ckb.rpc.getBlock(transaction.tx_status.block_hash)
  const symbols = await fetchSymbols()
  const { index, timestamp, price } = parseBandData(data)
  return {
    timestamp,
    token: symbols[index].toUpperCase(),
    price: parseBandPrice(price),
    change: '--',
    from: 'Band Protocol',
    source: 'band',
    destination: {
      tx_hash: transaction.transaction.hash,
      block_number: block.header.number,
      timestamp: block.header.timestamp,
    },
  }
}

const handleBandOracle = async () => {
  const blockNumber = (await indexer.tip()).block_number
  const transactions = await collectTransactions(blockNumber)
  const tokenInfoList = []
  for (let transaction of transactions) {
    let cellData = transaction.transaction.outputs_data.slice(0, 50)
    for (let data of cellData) {
      const tokenInfo = await parseTokenInfo(transaction, data)
      console.log(`tokenInfo: ${JSON.stringify(tokenInfo)}`)
      tokenInfoList.push(tokenInfo)
    }
  }
  console.log('store band token info')
  process.send({
    action: 'store',
    message: JSON.stringify(tokenInfoList),
  })
}

module.exports = {
  handleBandOracle,
}
