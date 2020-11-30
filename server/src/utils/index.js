const { BAND_CONFIG, BAND_SYMBOL } = require('./const')

const fetchSymbols = async () => {
  let res = await fetch(
    BAND_CONFIG.endpoint + `/oracle/price_symbols?ask_count=${BAND_CONFIG.ask_count}&min_count=${BAND_CONFIG.min_count}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  res = await res.json()
  return res['result']
}

const latestToken = tokenList => {
  if (!tokenList || tokenList.length === 0) return undefined
  let tokens = tokenList
  tokens.sort((a, b) => b.timestamp > a.timestamp)
  const baseTime = Math.floor(parseInt(tokens[0].timestamp) / 86400) * 86400
  const baseTokens = tokens.filter(token => Math.abs(parseInt(token.timestamp) - baseTime) <= 600)
  const basePrice = baseTokens.length > 0 ? parseFloat(baseTokens[0].price) : parseFloat(tokens[0].price)
  const change = `${(((parseFloat(tokens[0].price) - basePrice) / basePrice) * 100).toFixed(2)}%`
  return {
    ...tokens[0],
    change,
  }
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
  fetchSymbols,
  latestToken,
  parsePrice,
  remove0x,
  parseBandData,
}
