const fetchOpenOraclePayload = require('./oracle')

const oracle = async () => {
	const response = await fetchOpenOraclePayload()
	console.log(response)
}

oracle()
