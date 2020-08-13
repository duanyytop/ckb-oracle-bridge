const { getDetail } = require('./process')

const detail = async ctx => {
  const token = ctx.path.substring(ctx.path.lastIndexOf('/') + 1)
  const { timestamp } = ctx.query
  ctx.body = await getDetail(token, timestamp)
}

module.exports = detail
