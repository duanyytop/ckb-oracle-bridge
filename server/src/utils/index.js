const { BAND_SYMBOL } = require('./const')

const latestToken = tokenList => {
  if (!tokenList || tokenList.length === 0) return undefined
  let tokens = tokenList
  tokens.sort((a, b) => b.timestamp > a.timestamp)
  return tokens[0]
}

const parsePrice = price => {
  return Number(price) / 10 ** 6
}

const remove0x = hex => {
  if (hex.startsWith('0x')) {
    return hex.substring(2)
  }
  return hex
}

const u32ToInt = hex => {
  if (typeof hex !== 'string') {
    throw new Error('Invalid data type')
  }
  return parseInt(remove0x(hex), 16)
}

const u64ToInt = hex => {
  if (typeof hex !== 'string') {
    throw new Error('Invalid data type')
  }
  return parseInt(remove0x(hex), 16)
}

const parseBandData = data => {
  const temp = remove0x(data)
  const start = BAND_SYMBOL.length
  const index = parseInt(temp.substring(start, start + 2), 16)
  const timestamp = u32ToInt(temp.substring(start + 2, start + 10))
  const price = u64ToInt(temp.substring(start + 10))
  return { index, timestamp, price }
}

module.exports = {
  latestToken,
  parsePrice,
  remove0x,
  parseBandData,
}
