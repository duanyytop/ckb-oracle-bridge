const { handleBandOracle } = require('./band')
const { handleOkexOracle } = require('./okex')

const handleOracleData = async () => {
  await handleOkexOracle()
  await handleBandOracle()
}

module.exports = {
  handleOracleData,
}
