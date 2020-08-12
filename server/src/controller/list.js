const { getAllTokens } = require('../database')

const getList = async () => {
  const allTokens = await getAllTokens()
  return allTokens ? allTokens : []
}

const list = async ctx => {
  ctx.body = await getList()
}

module.exports = list
