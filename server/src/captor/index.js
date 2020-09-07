const { handleBandOracle } = require('./band')
const { handleOkexOracle } = require('./okex')

const handleOracleData = async () => {
  await handleBandOracle()
  await handleOkexOracle()
}

module.exports = {
  handleOracleData,
}
