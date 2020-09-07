const { getListWithSourceAndToken } = require('../database')

const history = async ctx => {
  const params = ctx.path.split('/').reverse()
  const source = params[1]
  const token = params[0].toUpperCase()
  ctx.body = await getListWithSourceAndToken(source, token)
}

module.exports = history
