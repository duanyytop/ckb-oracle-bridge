const { getListWithToken } = require('../database')

const history = async ctx => {
  const token = ctx.path.substring(ctx.path.lastIndexOf('/') + 1).toUpperCase()
  ctx.body = (await getListWithToken(token)).filter((_, index) => index % 5 === 0).slice(0, 200)
}

module.exports = history
