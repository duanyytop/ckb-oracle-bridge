const TokenContractTable = require('./table')

const assertDataTypeInt = value => {
  if (typeof value !== 'number' && typeof value !== 'bigint') {
    throw new Error('Invalid data type')
  }
  return true
}

const intToU64 = num => {
  assertDataTypeInt(num)
  const u64 = num.toString(16)
  return `${'0'.repeat(16 - u64.length)}${u64}`
}

const intToU256 = num => {
  assertDataTypeInt(num)
  const u256 = num.toString(16)
  return `${'0'.repeat(64 - u256.length)}${u256}`
}

const uintHexToInt = hex => {
  if (typeof hex !== 'string') {
    throw new Error('Invalid data type')
  }
  return BigInt(hex.startsWith('0x') ? hex : `0x${hex}`).toString()
}

const getTokenByContract = contract => {
  const table = TokenContractTable.filter(item => {
    return item.contract === contract
  })
  if (table.length > 0) {
    return table[0].token
  }
  return ''
}

module.exports = { assertDataTypeInt, intToU64, intToU256, uintHexToInt, getTokenByContract }
