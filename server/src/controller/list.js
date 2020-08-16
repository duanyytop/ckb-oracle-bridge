const { getAllTokens } = require('../database')

const list = async ctx => {
  ctx.body = await getAllTokens()
}

module.exports = list
