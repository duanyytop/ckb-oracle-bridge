const CKB = require('@nervosnetwork/ckb-sdk-core').default
const { TransactionCollector } = require('@ckb-lumos/indexer')
const { indexer } = require('../indexer/index')
const { CKB_NODE_URL } = require('../utils/config')
const { parseBandData } = require('../utils')
const { BAND_ORACLE_LOCK, BAND_TOKENS } = require('../utils/const')

const ckb = new CKB(CKB_NODE_URL)

let lastBlock = 0
const collectTransactions = async ({ fromBlock = 0 }) => {
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
    price: price,
    change: '--',
    from: 'BandChain',
    destination: {
      tx_hash: transaction.transaction.hash,
      block_number: block.header.number,
      timestamp: block.header.timestamp,
    },
  }
}

const handleBandOracle = async tipNumber => {
  const blockNumber = (await indexer.tip()).block_number
  if (blockNumber !== tipNumber) {
    setTimeout(async () => {
      await handleBandOracle(tipNumber)
    }, 1000)
  } else {
    const transactions = await collectTransactions({ fromBlock: lastBlock })
    lastBlock = blockNumber
    for (let transaction of transactions) {
      for (let data of transaction.transaction.outputs_data) {
        if (data === '0x') break
        const tokenInfo = await parseTokenInfo(transaction, data)
        process.send({
          action: 'store',
          message: JSON.stringify(tokenInfo),
        })
      }
    }
  }
}

module.exports = {
  handleBandOracle,
}
