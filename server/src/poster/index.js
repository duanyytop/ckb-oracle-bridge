const CKB = require('@nervosnetwork/ckb-sdk-core').default
const { PRI_KEY, ADDRESS, collectCells } = require('./poster')
const { CKB_NODE_URL } = require('../utils/config')
const fetchOpenOraclePayload = require('./service')
const { indexer } = require('../indexer')

const ckb = new CKB(CKB_NODE_URL)

let oracleStack = []
const fetchOracleData = async () => {
	setInterval(async () => {
		const response = await fetchOpenOraclePayload()
		const { messages, signatures } = response
		for (let i = 0; i < messages.length; i++) {
			oracleStack.push({ message: messages[i], signature: signatures[i] })
		}
	}, 10000)
}

const postOracleToCKB = async () => {
	const blockNumber = (await indexer.tip()).block_number
	const tipNumber = await ckb.rpc.getTipBlockNumber()
	const oracle = oracleStack.pop()
	if (blockNumber !== tipNumber || !oracle) {
		setTimeout(async () => {
			await postOracleToCKB()
		}, 1000)
	} else {
		const secp256k1Dep = await ckb.loadSecp256k1Dep()
		const cells = await collectCells()
		const rawTx = ckb.generateRawTransaction({
			fromAddress: ADDRESS,
			toAddress: ADDRESS,
			capacity: 50000000000,
			fee: 100000,
			safeMode: true,
			cells,
			deps: secp256k1Dep,
		})
		rawTx.witnesses = rawTx.inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }))
		rawTx.outputsData = [oracle.message, '0x']
		const signedTx = ckb.signTransaction(PRI_KEY)(rawTx)
		const txHash = await ckb.rpc.sendTransaction(signedTx)
		console.info(`Transaction has been sent with tx hash ${txHash}`)
	}
}

module.exports = {
	fetchOracleData,
	postOracleToCKB,
}
