const { getHistory } = require('./process')

const history = async ctx => {
  const token = ctx.path.substring(ctx.path.lastIndexOf('/') + 1)
  ctx.body = await getHistory(token)
}

module.exports = history
