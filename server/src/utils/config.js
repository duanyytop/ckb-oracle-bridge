require('dotenv').config()
const CKB_NODE_URL = process.env.CKB_NODE_URL || 'http://localhost:8114'
const CKB_WEBSOCKET_URL = process.env.CKB_WEBSOCKET_URL || 'ws://localhost:28114'

module.exports = {
  CKB_WEBSOCKET_URL,
  CKB_NODE_URL,
}
