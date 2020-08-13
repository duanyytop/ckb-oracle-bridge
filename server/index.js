const Koa = require('koa')
const { fork } = require('child_process')
const indexerWorker = fork(__dirname + '/src/indexer/worker.js')
const router = require('./src/router')
const { initWorker } = require('./src/controller/process')

initWorker(indexerWorker)

const koa = new Koa()

koa.use(router.routes())

koa.listen(40000)
