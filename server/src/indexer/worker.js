const CKB = require('@nervosnetwork/ckb-sdk-core').default
const { Indexer, TransactionCollector } = require('@ckb-lumos/indexer')
const { Reporter } = require('open-oracle-reporter')
const WebSocket = require('ws')
const { PRI_KEY, CKB_NODE_URL, CKB_WEBSOCKET_URL } = require('../utils/config')
const { parsePrice } = require('../utils')

const ckb = new CKB(CKB_NODE_URL)
const ARGS = '0x' + ckb.utils.blake160(ckb.utils.privateKeyToPublicKey(PRI_KEY), 'hex')

const indexer = new Indexer(CKB_NODE_URL, './src/indexed-data')
indexer.startForever()

let lastBlock = 0

const lockScript = () => {
	return {
		codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
		hashType: 'type',
		args: ARGS,
	}
}

const collectTransactions = async ({ codeHash, hashType, args, fromBlock = 0 }) => {
	const collector = new TransactionCollector(indexer, {
		lock: {
			code_hash: codeHash,
			hash_type: hashType,
			args,
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
	const decoded = Reporter.decode('prices', [data])
	if (decoded && decoded.length > 0) {
		const arr = decoded[0]
		return {
			timestamp: arr[0],
			token: arr[1].toLowerCase(),
			price: parsePrice(arr[2]),
			change: '--',
			from: 'Coinbase',
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
		const transactions = await collectTransactions({ ...lockScript(), fromBlock: lastBlock })
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

process.on('message', async msg => {
	const { action } = msg
	if (action === 'start') {
		subscribeTipBlock(async tipNumber => {
			await parseAndStoreTokenInfo(tipNumber)
		})
	}
})
