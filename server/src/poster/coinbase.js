const crypto = require('crypto')
const fetch = require('node-fetch')
const { COINBASE_ENDPOINT } = require('../utils/const')
const { COINBASE_API_KEY_ID, COINBASE_API_SECRET, COINBASE_API_PASSPHRASE } = require('../utils/config')

const fetchCoinbasePayload = async () => {
	const timestamp = Date.now() / 1000
	const what = `${timestamp}GET/oracle`
	const key = Buffer.from(COINBASE_API_SECRET, 'base64')
	const hmac = crypto.createHmac('sha256', key)
	const signature = hmac.update(what).digest('base64')
	const headers = {
		'CB-ACCESS-KEY': COINBASE_API_KEY_ID,
		'CB-ACCESS-SIGN': signature,
		'CB-ACCESS-TIMESTAMP': timestamp,
		'CB-ACCESS-PASSPHRASE': COINBASE_API_PASSPHRASE,
		'Content-Type': 'application/json',
	}

	return await fetch(COINBASE_ENDPOINT, {
		headers: headers,
	})
}

module.exports = fetchCoinbasePayload
