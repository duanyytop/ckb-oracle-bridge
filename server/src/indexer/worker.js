require('dotenv/config')
const { Indexer, TransactionCollector } = require('@ckb-lumos/indexer')
const { Reporter } = require('open-oracle-reporter')
const WebSocket = require('ws')
const { putTokenInfo } = require('../database')
const { ARGS, CKB_NODE_URL, CKB_WEBSOCKET_URL } = require('../utils/config')

const indexer = new Indexer(CKB_NODE_URL, './indexed-data')
indexer.startForever()

const collectTransactions = async ({ codeHash, hashType, args }) => {
  const collector = new TransactionCollector(indexer, {
    lock: {
      code_hash: codeHash,
      hash_type: hashType,
      args,
    },
  })
  const transactions = []
  for await (const transaction of collector.collect()) {
    transactions.push(transaction)
  }
  return transactions
}

const lockScript = () => {
  return {
    codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
    hashType: 'type',
    args: ARGS,
  }
}

const parseTokenInfo = async data => {
  const decoded = Reporter.decode('prices', data)
  if (decoded && decoded.length > 0) {
    const { timestamp, token, price } = decoded[0]
    return {
      token,
      price,
      timestamp,
      destination: {
        tx_hash: transaction.transaction.hash,
        block_number: block.header.number,
        timestamp: block.header.timestamp,
      },
    }
  }
}

const parseAndStoreOracleData = async tipNumber => {
  const blockNumber = (await indexer.tip()).block_number
  if (blockNumber !== tipNumber) {
    setTimeout(async () => {
      await parseAndStoreOracleData(tipNumber)
    }, 1000)
  } else {
    const transactions = await collectTransactions(lockScript())
    for (let transaction of transactions) {
      for (let data of transaction.transaction.outputs_data) {
        if (data === '0x') break
        const tokenInfo = await parseTokenInfo(data)
        await putTokenInfo(tokenInfo)
      }
    }
  }
  
}

const subscribeTipBlock = callback => {
  const ws = new WebSocket(CKB_WEBSOCKET_URL)

  ws.on('open', function open() {
    ws.send(`{"id": 2, "jsonrpc": "2.0", "method": "subscribe", "params": ["new_tip_header"]}`)
  })

  ws.on('message', function incoming(data) {
    if (JSON.parse(data).params) {
      callback(JSON.parse(JSON.parse(data).params.result).number)
    }
  })
}

process.on('message', async msg => {
  const { start } = msg
  if (start) {
    subscribeTipBlock( async tipNumber => {
      await parseAndStoreOracleData(tipNumber)
    })
  }
})
