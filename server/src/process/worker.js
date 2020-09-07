const WebSocket = require('ws')
const { CKB_WEBSOCKET_URL } = require('../utils/config')
const { handleOracleData } = require('../captor/index')
const { startIndexer, isIndexerTip } = require('../indexer')

const subscribeTipBlock = callback => {
  const ws = new WebSocket(CKB_WEBSOCKET_URL)
  let latestTipNumber = ''

  ws.on('open', function open() {
    ws.send('{"id": 2, "jsonrpc": "2.0", "method": "subscribe", "params": ["new_tip_header"]}')
  })

  ws.on('message', function incoming(data) {
    if (JSON.parse(data).params) {
      const tipNumber = JSON.parse(JSON.parse(data).params.result).number
      latestTipNumber = tipNumber
      console.info('New Block', tipNumber)
      callback(tipNumber)
    }
  })

  ws.on('close', function close(code, reason) {
    console.info('Websocket Close', code, reason)
    callback(latestTipNumber)
    subscribeTipBlock(callback)
  })
}

const startOracle = async () => {
  if (await isIndexerTip()) {
    subscribeTipBlock(async () => {
      await handleOracleData()
    })
  } else {
    setTimeout(() => {
      startOracle()
    }, 2000)
  }
}

process.on('message', async msg => {
  const { action } = msg
  if (action === 'start') {
    startIndexer()
    setTimeout(async () => {
      await startOracle()
    }, 2000)
  }
})
