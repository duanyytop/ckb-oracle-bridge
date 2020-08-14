const { getDetail } = require('./process')

const detail = async ctx => {
  const params = ctx.path.split('/').reverse()
  const token = params[1]
  const timestamp = params[0]
  ctx.body = await getDetail(token, timestamp)
}

module.exports = detail
