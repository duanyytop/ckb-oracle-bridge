const levelup = require('levelup')
const leveldown = require('leveldown')

let db = null

const createDB = () => {
  return levelup(leveldown('./token-info-db'))
}

const putTokenInfo = async tokenInfo => {
  if (!db) {
    db = createDB()
  }
  const { token, timestamp } = tokenInfo
  try {
    try {
      await db.get(`${token}:${timestamp}`)
    } catch (error) {
      if (error) {
        await db.put(`${token}:${timestamp}`, JSON.stringify(tokenInfo))
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const getTokenInfo = async (token, timestamp) => {
  if (!db) {
    db = createDB()
  }
  try {
    return (await db.get(`${token}:${timestamp}`)).toString('utf8')
  } catch (error) {
    console.error(error)
  }
}

const getTokenInfoList = token => {
  let tokenInfoList = []
  return new Promise((resolve, reject) => {
    if (!db) {
      db = createDB()
    }
    db.createReadStream({
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
      .on('end', () => {
        resolve(tokenInfoList)
      })
  })
}

const getAllTokens = () => {
  let tokenInfoList = []
  return new Promise((resolve, reject) => {
    if (!db) {
      db = createDB()
    }
    db.createReadStream({
      gte: `&`,
      lte: `~`,
      reverse: true,
    })
      .on('data', data => {
        tokenInfoList.push(JSON.parse(data.value.toString('utf8')))
      })
      .on('error', error => {
        reject(error)
      })
      .on('end', () => {
        resolve(tokenInfoList)
      })
  })
}

module.exports = { putTokenInfo, getTokenInfo, getTokenInfoList, getAllTokens }
