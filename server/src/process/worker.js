const { startIndexer } = require('../indexer/index')
const { fetchOracleData, postOracleToCKB } = require('../poster/index')
const { subscribeTipBlock, parseAndStoreTokenInfo } = require('../captor/index')

process.on('message', async msg => {
	const { action } = msg
	if (action === 'start') {
		// start ckb-lumos Indexer
		startIndexer()

		// Fetch oracle data from OKEX or Coinbase or other Oracles
		fetchOracleData()

		// Post oracle data to Nervos CKB
		postOracleToCKB()

		// Parse and store oracle data from Nervos CKB block by block
		subscribeTipBlock(async tipNumber => {
			await parseAndStoreTokenInfo(tipNumber)
		})
	}
})
