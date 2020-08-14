const levelup = require('levelup')
const leveldown = require('leveldown')

let db = null
const getDB = () => {
  if (!db || db.isClosed()) {
    db = levelup(leveldown('./token-info-db'))
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

const getTokenInfoList = token => {
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
      })
      .on('data', data => {
        tokenInfoList.push(JSON.parse(data.value.toString('utf8')))
      })
      .on('error', error => {
        reject(error)
      })
      .on('end', async () => {
        console.log(JSON.stringify(tokenInfoList))
        resolve(tokenInfoList)
      })
  })
}

const getAllTokensInfo = () => {
  let allTokens = []
  return new Promise((resolve, reject) => {
    getDB()
      .createReadStream({
        gte: `&`,
        lte: `~`,
        reverse: true,
      })
      .on('data', data => {
        allTokens.push(JSON.parse(data.value.toString('utf8')))
      })
      .on('error', error => {
        reject(error)
      })
      .on('end', async () => {
        console.log(JSON.stringify(allTokens))
        resolve(allTokens)
      })
  })
}

module.exports = { putTokenInfo, getTokenInfo, getTokenInfoList, getAllTokensInfo }
