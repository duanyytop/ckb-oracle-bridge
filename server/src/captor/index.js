const CKB = require('@nervosnetwork/ckb-sdk-core').default
const { TransactionCollector } = require('@ckb-lumos/indexer')
const { Reporter } = require('open-oracle-reporter')
const WebSocket = require('ws')
const { indexer } = require('../indexer/index')
const { CKB_NODE_URL, CKB_WEBSOCKET_URL } = require('../utils/config')
const { parsePrice } = require('../utils')
const CaptorLockScript = require('./captor')

const ckb = new CKB(CKB_NODE_URL)

let lastBlock = 0
const collectTransactions = async ({ fromBlock = 0 }) => {
	const collector = new TransactionCollector(indexer, {
		lock: CaptorLockScript,
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
	const decoded = Reporter.decode('prices', [data])
	if (decoded && decoded.length > 0) {
		const arr = decoded[0]
		return {
			timestamp: arr[0],
			token: arr[1].toLowerCase(),
			price: parsePrice(arr[2]),
			change: '--',
			from: 'OKEX',
			destination: {
				tx_hash: transaction.transaction.hash,
				block_number: block.header.number,
				timestamp: block.header.timestamp,
			},
		}
	}
}

const parseAndStoreTokenInfo = async tipNumber => {
	const blockNumber = (await indexer.tip()).block_number
	if (blockNumber !== tipNumber) {
		setTimeout(async () => {
			await parseAndStoreTokenInfo(tipNumber)
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

const subscribeTipBlock = callback => {
	const ws = new WebSocket(CKB_WEBSOCKET_URL)
	ws.on('open', function open() {
		ws.send('{"id": 2, "jsonrpc": "2.0", "method": "subscribe", "params": ["new_tip_header"]}')
	})
	ws.on('message', function incoming(data) {
		if (JSON.parse(data).params) {
			const tipNumber = JSON.parse(JSON.parse(data).params.result).number
			console.info('New Block', tipNumber)
			callback(tipNumber)
		}
	})
}

module.exports = {
	subscribeTipBlock,
	parseAndStoreTokenInfo,
}
