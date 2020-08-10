const router = require('koa-router')()
const list = require('../controller/list')
const history = require('../controller/history')
const detail = require('../controller/detail')

router
  .get('/prices', list)
  .get('/history/:contract', history)
  .get('/prices/:contract', detail)

module.exports = router
