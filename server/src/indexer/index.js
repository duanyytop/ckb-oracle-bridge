const { Indexer } = require('@ckb-lumos/indexer')
const { CKB_NODE_URL } = require('../utils/config')

const indexer = new Indexer(CKB_NODE_URL, './src/indexed-data')

const startIndexer = () => {
	indexer.startForever()
}

module.exports = {
	indexer,
	startIndexer,
}
