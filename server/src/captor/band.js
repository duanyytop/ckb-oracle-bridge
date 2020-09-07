const CKB = require('@nervosnetwork/ckb-sdk-core').default
const { TransactionCollector } = require('@ckb-lumos/indexer')
const { indexer } = require('../indexer/index')
const { CKB_NODE_URL } = require('../utils/config')
const { parseBandData, parsePrice } = require('../utils')
const { BAND_ORACLE_LOCK, BAND_TOKENS } = require('../utils/const')

const ckb = new CKB(CKB_NODE_URL)

let latestFromNumber = 0
const collectTransactions = async (fromBlock = 0) => {
  const collector = new TransactionCollector(indexer, {
    lock: {
      code_hash: BAND_ORACLE_LOCK.codeHash,
      hash_type: BAND_ORACLE_LOCK.hashType,
      args: BAND_ORACLE_LOCK.args,
    },
    fromBlock,
  })
  const transactions = []
  for await (const transaction of collector.collect()) {
    transactions.push(transaction)
  }
  return transactions
}

const parseTokenInfo = async (transaction, data) => {
  const block = await ckb.rpc.getBlock(transaction.tx_status.block_hash)
  const { index, timestamp, price } = parseBandData(data)
  return {
    timestamp,
    token: BAND_TOKENS[index].toUpperCase(),
    price: parsePrice(price),
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
  const transactions = await collectTransactions(latestFromNumber)
  latestFromNumber = parseInt(latestFromNumber, 16)
  const tokenInfoList = []
  for (let transaction of transactions) {
    for (let data of transaction.transaction.outputs_data) {
      if (data === '0x') break
      const tokenInfo = await parseTokenInfo(transaction, data)
      tokenInfoList.push(tokenInfo)
    }
  }
  process.send({
    action: 'store',
    message: JSON.stringify(tokenInfoList.reverse()),
  })
}

module.exports = {
  handleBandOracle,
}
