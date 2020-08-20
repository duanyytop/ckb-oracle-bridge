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

module.exports = {
  latestToken,
  parsePrice,
  remove0x,
}
