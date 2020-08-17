const Koa = require('koa')
const { fork } = require('child_process')
const router = require('./src/router')
const { responseConfig } = require('./src/middleware/index')
const { initWorker } = require('./src/process')
const indexerWorker = fork(__dirname + '/src/indexer/worker.js')

initWorker(indexerWorker)

const koa = new Koa()
koa.use(responseConfig)
koa.use(router.routes())

koa.listen(40000)
