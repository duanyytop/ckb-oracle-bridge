const { handleBandOracle } = require('./band')
const { handleOkexOracle } = require('./okex')

const handleOracleData = async tipNumber => {
  await handleBandOracle()
  await handleOkexOracle(tipNumber)
}

module.exports = {
  handleOracleData,
}
