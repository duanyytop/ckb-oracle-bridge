const crypto = require('crypto')
const fetch = require('node-fetch')
const { OKEX_ENDPOINT } = require('../utils/const')
const { OKEX_API_KEY_ID, OKEX_API_SECRET, OKEX_API_PASSPHRASE } = require('../utils/config')

const fetchOpenOraclePayload = async () => {
  const timestamp = Date.now() / 1000
  const what = `${timestamp}GET/api/market/v3/oracle`
  const key = Buffer.from(OKEX_API_SECRET, 'base64')
  const hmac = crypto.createHmac('sha256', key)
  const signature = hmac.update(what).digest('base64')
  const headers = {
    'CB-ACCESS-KEY': OKEX_API_KEY_ID,
    'CB-ACCESS-SIGN': signature,
    'CB-ACCESS-TIMESTAMP': timestamp,
    'CB-ACCESS-PASSPHRASE': OKEX_API_PASSPHRASE,
    'Content-Type': 'application/json',
  }

  try {
    const res = await fetch(OKEX_ENDPOINT, {
      headers: headers,
    })
    return await res.json()
  } catch (error) {
    console.error(error)
  }
}

module.exports = fetchOpenOraclePayload
