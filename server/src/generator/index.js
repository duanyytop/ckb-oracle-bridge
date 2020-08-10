/**
 * The generator is an example which send ETH/USD contact and token information to Nervos CKB Aggron Testnet.
 */

require('dotenv/config')
const { Indexer, CellCollector } = require('@ckb-lumos/indexer')
const { intToU64, intToU256 } = require('../utils')
const { ckb, PRI_KEY, ARGS, ADDRESS } = require('../utils/config')

const indexer = new Indexer('http://127.0.0.1:8114', './indexed-data')
indexer.startForever()

const collectCells = async ({ codeHash, hashType, args }) => {
  const collector = new CellCollector(indexer, {
    lock: {
      code_hash: codeHash,
      hash_type: hashType,
      args,
    },
  })

  const cells = []
  const EMPTY_DATA_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

  for await (const cell of collector.collect()) {
    cells.push({
      dataHash: cell.data === '0x' ? EMPTY_DATA_HASH : cell.data,
      type: cell.cell_output.type || null,
      capacity: cell.cell_output.capacity,
      outPoint: { txHash: cell.out_point.tx_hash, index: cell.out_point.index },
    })
  }

  return cells
}

// Ethereum transaction data is from https://etherscan.io/tx/0x7992e06b4c34c4a6022f5576e98496c3c3ac14b8727c7a8fd859bb774f34b8e1
const oracleData = () => {
  const price = intToU256(23372000000)
  const timestamp = intToU256(1595482497)
  const sender = '501698a6f6f762c79e4d28e3815c135e3f9af996'
  const txHash = '7992e06b4c34c4a6022f5576e98496c3c3ac14b8727c7a8fd859bb774f34b8e1'
  const nonce = intToU64(147068)
  const gasPrice = intToU64(43000000000)
  const gasLimit = intToU64(500000)
  const amount = intToU64(0)
  const payload =
    '4ab0d19046297ffdea553da4a93feba4c20074a0511b593a6f62c8dec2a4ce363ba7f4660000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000f79d6afbb6da890132f9d7c355e3015f15f3406f6a9705b400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005f1621810000000000000000000000000000000000000000000000000000000571517400'
  return `0x${price}${timestamp}${sender}${txHash}${nonce}${gasPrice}${gasLimit}${amount}${payload}`
}

const generator = async () => {
  const blockNumber = (await indexer.tip()).block_number
  const tipNumber = await ckb.rpc.getTipBlockNumber()
  if (blockNumber !== tipNumber) {
    setTimeout(async () => {
      await generator()
    }, 1000)
  } else {
    const secp256k1Dep = await ckb.loadSecp256k1Dep()
    const cells = await collectCells({ ...secp256k1Dep, args: ARGS })

    const rawTx = ckb.generateRawTransaction({
      fromAddress: ADDRESS,
      toAddress: ADDRESS,
      capacity: 50000000000n,
      fee: 100000n,
      safeMode: true,
      cells,
      deps: secp256k1Dep,
    })

    rawTx.witnesses = rawTx.inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }))
    rawTx.outputsData = [oracleData(), '0x']
    const signedTx = ckb.signTransaction(PRI_KEY)(rawTx)
    const txHash = await ckb.rpc.sendTransaction(signedTx)
    console.info(`Transaction has been sent with tx hash ${txHash}`)
    return txHash
  }
}

generator()
