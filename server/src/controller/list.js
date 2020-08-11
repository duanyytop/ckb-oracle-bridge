const { getTokenInfoList } = require('../database')

const getList = async () => {
  const tokenInfoList = await getTokenInfoList('f79d6afbb6da890132f9d7c355e3015f15f3406f')
  return tokenInfoList ? tokenInfoList : []
}

const list = async ctx => {
  ctx.body = await getList()
}

module.exports = list
