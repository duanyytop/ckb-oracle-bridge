const CKB_NODE_URL = process.env.CKB_NODE_URL || 'http://localhost:8114'
const CKB_WEBSOCKET_URL = process.env.CKB_WEBSOCKET_URL || 'ws://localhost:28114'

const PRI_KEY = '0x70d336d8661e36c6cd6d510e560f4b2669d4875bcc41cd6538cad93061d6d400' // private key for demo, don't expose it in production

module.exports = {
  PRI_KEY,
  CKB_WEBSOCKET_URL,
  CKB_NODE_URL,
}
