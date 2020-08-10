const { getTokenInfoList } = require('../database')

const getHistory = async contract => {
  const tokenInfoList = await getTokenInfoList(contract)
  return tokenInfoList ? tokenInfoList : []
}

const history = async ctx => {
  const contract = ctx.path.substring(ctx.path.lastIndexOf('/') + 1)
  ctx.body = await getHistory(contract)
}

module.exports = history
