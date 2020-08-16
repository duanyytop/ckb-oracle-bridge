const { parsePrice } = require('../src/utils')

describe('Utils tests', () => {
  it('parsePrice', async () => {
    expect(parsePrice(8845095000)).toBe(8845.095)
    expect(parsePrice(228850000)).toBe(228.85)
  })
})
