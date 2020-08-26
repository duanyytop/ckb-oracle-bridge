const levelup = require('levelup')
const leveldown = require('leveldown')
const { latestToken } = require('../utils')
const { DATABASE_TOKENS } = require('../utils/const')

let db = null
const getDB = () => {
  if (!db || db.isClosed()) {
    db = levelup(leveldown('./src/token-info-db'))
  }
  return db
}

const putTokenInfo = async tokenInfo => {
  const { token, timestamp } = tokenInfo
  if (!token || !timestamp) {
    throw new Error('Database error: Token or timestamp is undefined')
  }
  if (await getTokenInfo()) {
    return
  }
  try {
    await getDB().put(`${token}:${timestamp}`, JSON.stringify(tokenInfo))
  } catch (error) {
    console.error(error)
  }
}

const getTokenInfo = async (token, timestamp) => {
  if (!token || !timestamp) {
    return null
  }
  try {
    return (await getDB().get(`${token}:${timestamp}`)).toString('utf8')
  } catch (error) {
    console.error(error)
  }
}

const getListWithToken = token => {
  if (!token) {
    throw []
  }
  let tokenInfoList = []
  return new Promise((resolve, reject) => {
    getDB()
      .createReadStream({
        gte: `${token}:`,
        lte: `${token}:~`,
        reverse: true,
        limit: 300,
      })
      .on('data', data => {
        tokenInfoList.push(JSON.parse(data.value.toString('utf8')))
      })
      .on('error', error => {
        reject(error)
      })
      .on('end', async () => {
        resolve(tokenInfoList)
      })
  })
}

const getAllTokens = async () => {
  const tokenList = []
  for await (const token of DATABASE_TOKENS) {
    const tokenInfo = latestToken(await getListWithToken(token))
    if (tokenInfo) {
      tokenList.push(tokenInfo)
    }
  }
  return tokenList
}

module.exports = { putTokenInfo, getTokenInfo, getListWithToken, getAllTokens }
