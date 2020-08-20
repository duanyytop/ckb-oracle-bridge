const { startIndexer, isIndexerTip } = require('../indexer/index')
const { fetchOracleData, postOracleToCKB } = require('../poster/index')
const { subscribeTipBlock, parseAndStoreTokenInfo } = require('../captor/index')

process.on('message', async msg => {
  const { action } = msg
  if (action === 'start') {
    // start ckb-lumos Indexer
    startIndexer()
    setInterval(async () => {
      if (await isIndexerTip()) {
        // Fetch oracle data from open oracles
        await fetchOracleData()
        // Post oracle data to Nervos CKB
        await postOracleToCKB()
        // Parse and store oracle data from Nervos CKB block by block
        subscribeTipBlock(async tipNumber => {
          await parseAndStoreTokenInfo(tipNumber)
        })
      }
    }, 2000)
  }
})
