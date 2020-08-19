const CKB_NODE_URL = process.env.CKB_NODE_URL || 'http://localhost:8114'
const CKB_WEBSOCKET_URL = process.env.CKB_WEBSOCKET_URL || 'ws://localhost:28114'

const PRI_KEY = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // private key for demo, don't expose it in production

const OKEX_API_KEY_ID = process.env.OKEX_API_KEY_ID
const OKEX_API_SECRET = process.env.OKEX_API_SECRET
const OKEX_API_PASSPHRASE = process.env.OKEX_API_PASSPHRASE

module.exports = {
	PRI_KEY,
	CKB_WEBSOCKET_URL,
	CKB_NODE_URL,
	OKEX_API_KEY_ID,
	OKEX_API_SECRET,
	OKEX_API_PASSPHRASE,
}
