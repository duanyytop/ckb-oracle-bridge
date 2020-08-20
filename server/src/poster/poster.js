const CKB = require('@nervosnetwork/ckb-sdk-core').default
const { CellCollector } = require('@ckb-lumos/indexer')
const BN = require('bn.js')
const { PRI_KEY, CKB_NODE_URL } = require('../utils/config')
const { indexer } = require('../indexer')
const { OracleLockScript, OracleDeps } = require('../captor/captor')
const { remove0x } = require('../utils/index')

const ckb = new CKB(CKB_NODE_URL)
const PUB_KEY = ckb.utils.privateKeyToPublicKey(PRI_KEY)
const ARGS = '0x' + ckb.utils.blake160(PUB_KEY, 'hex')

const posterLockScript = async () => {
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  return {
    codeHash: secp256k1Dep.codeHash,
    hashType: secp256k1Dep.hashType,
    args: ARGS,
  }
}

const secp256k1Dep = async () => {
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  return {
    outPoint: secp256k1Dep.outPoint,
    depType: 'depGroup',
  }
}

const collectCells = async capacity => {
  const lock = await posterLockScript()
  const collector = new CellCollector(indexer, {
    lock: {
      code_hash: lock.codeHash,
      hash_type: lock.hashType,
      args: lock.args,
    },
  })
  const cells = []
  let currentCapacity = new BN(0)
  for await (const cell of collector.collect()) {
    cells.push({
      dataHash: cell.data,
      type: cell.cell_output.type || null,
      capacity: cell.cell_output.capacity,
      outPoint: { txHash: cell.out_point.tx_hash, index: cell.out_point.index },
    })
    currentCapacity = currentCapacity.add(new BN(remove0x(cell.cell_output.capacity), 16))
    if (currentCapacity.add(new BN(1000000)).cmp(capacity) >= 0) {
      break
    }
  }
  if (currentCapacity.add(new BN(1000000)).cmp(capacity) < 0) {
    new Error('Capacity not enough')
  }
  return { cells, capacity: currentCapacity }
}

const collectOracleCells = async () => {
  const collector = new CellCollector(indexer, {
    lock: {
      code_hash: OracleLockScript.codeHash,
      hash_type: OracleLockScript.hashType,
      args: OracleLockScript.args,
    },
  })
  const cells = []
  for await (const cell of collector.collect()) {
    cells.push({
      dataHash: cell.data,
      type: cell.cell_output.type || null,
      capacity: cell.cell_output.capacity,
      outPoint: { txHash: cell.out_point.tx_hash, index: cell.out_point.index },
    })
  }
  return cells
}

const sendTransaction = async ({ message, signature }) => {
  const oracleCells = await collectOracleCells()
  if (oracleCells.length === 0) {
    const { cells, capacity } = await collectCells(new BN(56100000000))
    const rawTx = {
      version: '0x0',
      cellDeps: [await secp256k1Dep(), OracleDeps],
      headerDeps: [],
      inputs: cells.map(cell => {
        return { previousOutput: cell.outPoint, since: '0x0' }
      }),
      outputs: [
        {
          capacity: `0x${new BN(50000000000).toString(16)}`,
          lock: OracleLockScript,
          type: null,
        },
        {
          capacity: `0x${capacity.sub(new BN(50001000000)).toString(16)}`,
          lock: await posterLockScript(),
          type: null,
        },
      ],
      outputsData: [message, '0x'],
    }
    rawTx.witnesses = rawTx.inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }))
    console.log(JSON.stringify(rawTx))
    const signedTx = ckb.signTransaction(PRI_KEY)(rawTx)
    const txHash = await ckb.rpc.sendTransaction(signedTx)
    console.info(`Transaction has been sent with tx hash ${txHash}`)
  } else {
    const { cells, capacity } = await collectCells(new BN(6100000000))
    const rawTx = {
      witnesses: [signature, { lock: '', inputType: '', outputType: '' }],
      version: '0x0',
      cellDeps: [OracleDeps, await secp256k1Dep()],
      headerDeps: [],
      inputs: [
        { previousOutput: oracleCells[0].outPoint, since: '0x0' },
        { previousOutput: cells[0].outPoint, since: '0x0' },
      ],
      outputs: [
        {
          capacity: `0x${new BN(50000000000).toString(16)}`,
          lock: OracleLockScript,
          type: null,
        },
        {
          capacity: `0x${capacity.sub(new BN(1000000)).toString(16)}`,
          lock: await posterLockScript(),
          type: null,
        },
      ],
      outputsData: [message, '0x'],
    }
    console.log(JSON.stringify(rawTx))
    const signedTx = ckb.signTransaction(PRI_KEY)(rawTx)
    const txHash = await ckb.rpc.sendTransaction(signedTx)
    console.info(`Transaction has been sent with tx hash ${txHash}`)
  }
}

module.exports = {
  PRI_KEY,
  sendTransaction,
}
