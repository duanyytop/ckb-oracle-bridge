require('dotenv/config')
const { Indexer, TransactionCollector } = require('@ckb-lumos/indexer')
const { uintHexToInt, getTokenByContract } = require('../utils')
const { putTokenInfo } = require('../database')
const { ckb, ARGS } = require('../utils/config')

const indexer = new Indexer('http://127.0.0.1:8114', './indexed-data')
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

const SENDER_INDEX = 128
const parseTokenInfo = async data => {
  const block = await ckb.rpc.getBlock(transaction.tx_status.block_hash)
  const dataHex = data.startsWith('0x') ? data.substring(2) : data
  const sender = dataHex.substring(SENDER_INDEX, SENDER_INDEX + 40)
  const txHash = dataHex.substring(SENDER_INDEX + 40, SENDER_INDEX + 104)
  const nonce = uintHexToInt(dataHex.substring(SENDER_INDEX + 104, SENDER_INDEX + 120))
  const gasPrice = uintHexToInt(dataHex.substring(SENDER_INDEX + 120, SENDER_INDEX + 136))
  const gasLimit = uintHexToInt(dataHex.substring(SENDER_INDEX + 136, SENDER_INDEX + 152))
  const amount = uintHexToInt(dataHex.substring(SENDER_INDEX + 152, SENDER_INDEX + 168))
  const payload = dataHex.substring(SENDER_INDEX + 168)
  const contract = payload.substring(160, 200)
  const timestamp = uintHexToInt(payload.substring(264, 328))
  const price = uintHexToInt(payload.substring(328))

  return {
    contract,
    token: getTokenByContract(contract),
    price,
    timestamp,
    source: {
      sender,
      tx_hash: txHash,
      nonce,
      gas_price: gasPrice,
      gas_limit: gasLimit,
      amount,
      timestamp,
    },
    destination: {
      tx_hash: transaction.transaction.hash,
      block_number: block.header.number,
      timestamp: block.header.timestamp,
    },
  }
}

const parseAndStoreOracleData = async () => {
  const blockNumber = (await indexer.tip()).block_number
  const tipNumber = await ckb.rpc.getTipBlockNumber()
  if (blockNumber !== tipNumber) {
    setTimeout(async () => {
      await parseAndStoreOracleData()
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

const runCkbOracle = async () => {
  setInterval(async () => {
    await parseAndStoreOracleData()
  }, 1000)
}

process.on('message', async msg => {
  const { start } = msg
  if (start) {
    await runCkbOracle()
  }
})
