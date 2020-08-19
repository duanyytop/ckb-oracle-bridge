const CKB_NODE_URL = process.env.CKB_NODE_URL || 'http://localhost:8114'
const CKB_WEBSOCKET_URL = process.env.CKB_WEBSOCKET_URL || 'ws://localhost:28114'

const PRI_KEY = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // private key for demo, don't expose it in production

const COINBASE_API_KEY_ID = process.env.COINBASE_API_KEY_ID || ''
const COINBASE_API_SECRET = process.env.COINBASE_API_SECRET || ''
const COINBASE_API_PASSPHRASE = process.env.COINBASE_API_PASSPHRASE || ''

module.exports = {
	PRI_KEY,
	CKB_WEBSOCKET_URL,
	CKB_NODE_URL,
	COINBASE_API_KEY_ID,
	COINBASE_API_SECRET,
	COINBASE_API_PASSPHRASE,
}
