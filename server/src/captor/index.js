const { handleBandOracle } = require('./band')

const handleOracleData = async tipNumber => {
  await handleBandOracle(tipNumber)
}

module.exports = {
  handleOracleData,
}
