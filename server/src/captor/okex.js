const CKB = require('@nervosnetwork/ckb-sdk-core').default
const { TransactionCollector } = require('@ckb-lumos/indexer')
const { Reporter } = require('open-oracle-reporter')
const { indexer } = require('../indexer/index')
const { CKB_NODE_URL } = require('../utils/config')
const { parsePrice } = require('../utils')
const { OKEX_ORACLE_LOCK } = require('../utils/const')

const ckb = new CKB(CKB_NODE_URL)

const collectTransactions = async toBlock => {
  let toBlockNumber = parseInt(toBlock, 16)
  let fromBlock = toBlockNumber > 100 ? `0x${(toBlockNumber - 100).toString(16)}` : '0x0'
  const collector = new TransactionCollector(indexer, {
    lock: {
      code_hash: OKEX_ORACLE_LOCK.codeHash,
      hash_type: OKEX_ORACLE_LOCK.hashType,
      args: OKEX_ORACLE_LOCK.args,
    },
    fromBlock,
    toBlock,
    order: 'desc',
  })
  console.info(`Okex fromBlock: ${fromBlock} --- toBlock: ${toBlock}`)
  const transactions = []
  for await (const transaction of collector.collect()) {
    transactions.push(transaction)
  }
  return transactions
}

const parseTokenInfo = async (transaction, data) => {
  const block = await ckb.rpc.getBlock(transaction.tx_status.block_hash)
  const decoded = Reporter.decode('prices', [data])
  if (decoded && decoded.length > 0) {
    const arr = decoded[0]
    return {
      timestamp: arr[0],
      token: arr[1].toUpperCase(),
      price: parsePrice(arr[2]),
      change: '--',
      from: 'OKEX Oracle',
      source: 'okex',
      destination: {
        tx_hash: transaction.transaction.hash,
        block_number: block.header.number,
        timestamp: block.header.timestamp,
      },
    }
  }
}

const handleOkexOracle = async () => {
  const blockNumber = (await indexer.tip()).block_number
  const transactions = await collectTransactions(blockNumber)
  const tokenInfoList = []
  for (let transaction of transactions) {
    for (let data of transaction.transaction.outputs_data) {
      if (data === '0x') continue
      const tokenInfo = await parseTokenInfo(transaction, data)
      tokenInfoList.push(tokenInfo)
    }
  }
  console.log('store okex token info')
  process.send({
    action: 'store',
    message: JSON.stringify(tokenInfoList),
  })
}

module.exports = {
  handleOkexOracle,
}
