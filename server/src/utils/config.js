const CKB_NODE_URL = process.env.CKB_NODE_URL || 'http://localhost:8114'
const CKB_WEBSOCKET_URL = process.env.CKB_WEBSOCKET_URL || 'ws://localhost:28114'

const PRI_KEY = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // private key for demo, don't expose it in production

module.exports = {
	PRI_KEY,
	CKB_WEBSOCKET_URL,
	CKB_NODE_URL,
}
