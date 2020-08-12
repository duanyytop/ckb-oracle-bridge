require('dotenv/config')
const CKB = require('@nervosnetwork/ckb-sdk-core').default

const CKB_NODE_URL = process.env.CKB_NODE_URL || 'http://localhost:8114'
const ckb = new CKB(CKB_NODE_URL)

const CKB_WEBSOCKET_URL = process.env.CKB_WEBSOCKET_URL || 'ws://localhost:28114'

const PRI_KEY = process.env.PRI_KEY || '0x70d336d8661e36c6cd6d510e560f4b2669d4875bcc41cd6538cad93061d6d400' // private key for demo, don't expose it in production
const PUB_KEY = ckb.utils.privateKeyToPublicKey(PRI_KEY)
const ARGS = '0x' + ckb.utils.blake160(PUB_KEY, 'hex')
const ADDRESS = ckb.utils.pubkeyToAddress(PUB_KEY)

module.exports = { ckb, PRI_KEY, ARGS, ADDRESS, CKB_WEBSOCKET_URL, CKB_NODE_URL }
