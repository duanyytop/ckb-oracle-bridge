const { getTokenInfo } = require('../database')

const detail = async ctx => {
	const params = ctx.path.split('/').reverse()
	const token = params[1]
	const timestamp = params[0]
	ctx.body = await getTokenInfo(token, timestamp)
}

module.exports = detail
