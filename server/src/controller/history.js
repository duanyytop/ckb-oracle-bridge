const { getTokenInfoList } = require('../database')

const getHistory = async token => {
  const tokenInfoList = await getTokenInfoList(token)
  return tokenInfoList ? tokenInfoList : []
}

const history = async ctx => {
  const token = ctx.path.substring(ctx.path.lastIndexOf('/') + 1)
  ctx.body = await getHistory(token)
}

module.exports = history
