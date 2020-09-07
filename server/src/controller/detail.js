const { getTokenInfo } = require('../database')

const detail = async ctx => {
  const params = ctx.path.split('/').reverse()
  const source = params[2]
  const token = params[1].toUpperCase()
  const timestamp = params[0]
  ctx.body = await getTokenInfo(source, token, timestamp)
}

module.exports = detail
