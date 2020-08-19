const CKB = require('@nervosnetwork/ckb-sdk-core').default
const { CellCollector } = require('@ckb-lumos/indexer')
const { PRI_KEY, CKB_NODE_URL } = require('../utils/config')
const { indexer } = require('../indexer')

const ckb = new CKB(CKB_NODE_URL)
const PUB_KEY = ckb.utils.privateKeyToPublicKey(PRI_KEY)
const ARGS = '0x' + ckb.utils.blake160(PUB_KEY, 'hex')
const ADDRESS = ckb.utils.pubkeyToAddress(PUB_KEY)

const collectCells = async () => {
	const secp256k1Dep = await ckb.loadSecp256k1Dep()
	const collector = new CellCollector(indexer, {
		lock: {
			...secp256k1Dep,
			args: ARGS,
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

module.exports = {
	PRI_KEY,
	ADDRESS,
	collectCells,
}
