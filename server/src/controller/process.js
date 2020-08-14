let indexerWorker = null
const initWorker = worker => {
  indexerWorker = worker
  worker.setMaxListeners(Infinity)
  indexerWorker.send({ action: 'start' })
}

const getList = () => {
  indexerWorker.send({ action: 'list' })

  return new Promise((resolve, _reject) => {
    indexerWorker.on('message', msg => {
      resolve(msg)
    })
  })
}

const getDetail = (token, timestamp) => {
  indexerWorker.send({ action: 'detail', params: { token, timestamp } })

  return new Promise((resolve, _reject) => {
    indexerWorker.on('message', msg => {
      resolve(msg)
    })
  })
}

const getHistory = token => {
  indexerWorker.send({ action: 'history', params: { token } })

  return new Promise((resolve, _reject) => {
    indexerWorker.on('message', msg => {
      resolve(msg)
    })
  })
}

module.exports = {
  initWorker,
  getList,
  getDetail,
  getHistory,
}
