const { putTokenInfo } = require('../database')

let indexerWorker = null
const initWorker = worker => {
  indexerWorker = worker
  indexerWorker.send({
    action: 'start',
  })

  indexerWorker.on('message', async msg => {
    const { action, message } = msg
    if (action === 'store') {
      await putTokenInfo(JSON.parse(message))
    }
  })
}

module.exports = {
  initWorker,
}
