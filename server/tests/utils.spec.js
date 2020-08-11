const { assertDataTypeInt, intToU64, intToU256, uintHexToInt } = require('../src/utils')

describe('Utils tests', () => {
  it('assertDataTypeInt', async () => {
    expect(assertDataTypeInt(12)).toBe(true)
    expect(assertDataTypeInt(BigInt('0x1234'))).toBe(true)
    expect(() => assertDataTypeInt('0x123')).toThrow(new Error('Invalid data type'))
  })

  it('intToU64', async () => {
    expect(intToU64(12)).toBe('000000000000000c')
    expect(intToU64(2354567453443)).toBe('0000022437281b03')
  })

  it('intToU256', async () => {
    expect(intToU256(12)).toBe('000000000000000000000000000000000000000000000000000000000000000c')
    expect(intToU256(2354567453443)).toBe('0000000000000000000000000000000000000000000000000000022437281b03')
  })

  it('uintHexToInt', async () => {
    expect(uintHexToInt('0000000000000000000000000000000000000000000000000000000571146b00')).toBe('23372000000')
    expect(uintHexToInt('0000000000000000000000000000000000000000000000000000022437281b03')).toBe('2354567453443')
  })
})
