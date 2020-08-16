const Koa = require('koa')
const { fork } = require('child_process')
const indexerWorker = fork(__dirname + '/src/indexer/worker.js')
const router = require('./src/router')
const { initWorker } = require('./src/process')

initWorker(indexerWorker)

const koa = new Koa()

koa.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200
  } else {
    await next()
  }
})

koa.use(router.routes())

koa.listen(40000)
