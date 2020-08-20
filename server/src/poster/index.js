const { sendTransaction } = require('./poster')
const fetchOpenOraclePayload = require('./service')

const MAX_STACK_CAP = 100
let oracleStack = []
const fetchOracleData = async () => {
  setInterval(async () => {
    const response = await fetchOpenOraclePayload()
    const { messages, signatures } = response
    if (!messages || messages.length < 1) {
      return
    }
    if (oracleStack.length > MAX_STACK_CAP) {
      return
    }
    for (let i = 0; i < messages.length; i++) {
      oracleStack.push({ message: messages[i], signature: signatures[i] })
    }
  }, 10000)
}

const postOracleToCKB = async () => {
  setInterval(async () => {
    const oracle = oracleStack.pop()
    if (oracle) {
      console.info('Start sending transaction')
      sendTransaction({ ...oracle })
    }
  }, 5000)
}

module.exports = {
  fetchOracleData,
  postOracleToCKB,
}
