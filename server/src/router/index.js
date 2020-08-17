const router = require('koa-router')()
const list = require('../controller/list')
const history = require('../controller/history')
const detail = require('../controller/detail')

router
	.get('/prices', list)
	.get('/history/:token', history)
	.get('/prices/:token/:timestamp', detail)

module.exports = router
