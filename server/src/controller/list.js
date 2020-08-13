const { getList } = require('./process')

const list = async ctx => {
  ctx.body = await getList()
}

module.exports = list
