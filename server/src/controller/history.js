const { getListWithToken } = require('../database')

const history = async ctx => {
  const token = ctx.path.substring(ctx.path.lastIndexOf('/') + 1)
  ctx.body = await getListWithToken(token)
}

module.exports = history
