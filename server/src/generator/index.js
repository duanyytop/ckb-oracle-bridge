// /**
//  * The generator is an example which send ETH/USD contact and token information to Nervos CKB Aggron Testnet.
//  */

// require('dotenv/config')
// const { Indexer, CellCollector } = require('@ckb-lumos/indexer')
// const { ckb, PRI_KEY, ARGS, ADDRESS, CKB_NODE_URL } = require('../utils/config')

// const indexer = new Indexer(CKB_NODE_URL, './indexed-data')
// indexer.startForever()

// const collectCells = async ({ codeHash, hashType, args }) => {
//   const collector = new CellCollector(indexer, {
//     lock: {
//       code_hash: codeHash,
//       hash_type: hashType,
//       args,
//     },
//   })

//   const cells = []
//   const EMPTY_DATA_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

//   for await (const cell of collector.collect()) {
//     cells.push({
//       dataHash: cell.data === '0x' ? EMPTY_DATA_HASH : cell.data,
//       type: cell.cell_output.type || null,
//       capacity: cell.cell_output.capacity,
//       outPoint: { txHash: cell.out_point.tx_hash, index: cell.out_point.index },
//     })
//   }

//   return cells
// }

// // Coinbase oracle data from https://docs.pro.coinbase.com/#oracle
// const oracleData = () => {
//   return '0x0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000005e5da58000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000020f3570580000000000000000000000000000000000000000000000000000000000000006707269636573000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034254430000000000000000000000000000000000000000000000000000000000'
// }

// const generator = async () => {
//   const blockNumber = (await indexer.tip()).block_number
//   const tipNumber = await ckb.rpc.getTipBlockNumber()
//   if (blockNumber !== tipNumber) {
//     setTimeout(async () => {
//       await generator()
//     }, 1000)
//   } else {
//     const secp256k1Dep = await ckb.loadSecp256k1Dep()
//     const cells = await collectCells({ ...secp256k1Dep, args: ARGS })

//     const rawTx = ckb.generateRawTransaction({
//       fromAddress: ADDRESS,
//       toAddress: ADDRESS,
//       capacity: 50000000000n,
//       fee: 100000n,
//       safeMode: true,
//       cells,
//       deps: secp256k1Dep,
//     })

//     rawTx.witnesses = rawTx.inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }))
//     rawTx.outputsData = [oracleData(), '0x']
//     const signedTx = ckb.signTransaction(PRI_KEY)(rawTx)
//     const txHash = await ckb.rpc.sendTransaction(signedTx)
//     console.info(`Transaction has been sent with tx hash ${txHash}`)
//     return txHash
//   }
// }

// generator()
