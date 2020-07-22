require("dotenv/config");
const CKB = require("@nervosnetwork/ckb-sdk-core").default;
const {Indexer, TransactionCollector} = require("@ckb-lumos/indexer");
const {uintHexToInt, getTokenByContract} = require("../utils");
const {setTokenInfo, getTokenInfo} = require("../database");

const indexer = new Indexer("http://127.0.0.1:8114", "./indexed-data");
indexer.startForever();

const CKB_URL = process.env.CKB_URL || "http://127.0.0.1:8114";
const ckb = new CKB(CKB_URL);

const PRI_KEY = process.env.PRI_KEY || "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"; // private key for demo, don't expose it in production
const PUB_KEY = ckb.utils.privateKeyToPublicKey(PRI_KEY);
const ARGS = "0x" + ckb.utils.blake160(PUB_KEY, "hex");

const collectTransactions = async ({codeHash, hashType, args}) => {
  const collector = new TransactionCollector(indexer, {
    lock: {
      code_hash: codeHash,
      hash_type: hashType,
      args
    }
  });
  const transactions = [];
  for await (const transaction of collector.collect()) {
    transactions.push(transaction);
  }
  return transactions;
};

const parseAndStoreOracleData = async () => {
  const blockNumber = (await indexer.tip()).block_number;
  const tipNumber = await ckb.rpc.getTipBlockNumber();
  if (blockNumber === tipNumber) {
    const transactions = await collectTransactions({
      codeHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      hashType: "type",
      args: ARGS
    });
    for (let transaction of transactions) {
      for (let data of transaction.transaction.outputs_data) {
        if (data === "0x") {
          break;
        }
        const payload = data.substring(data.startsWith("0x") ? 234 : 232);
        const contract = payload.substring(160, 200);
        const timestamp = uintHexToInt(payload.substring(264, 328));
        const price = uintHexToInt(payload.substring(328));

        await setTokenInfo({
          contract,
          token: getTokenByContract(contract),
          price,
          timestamp
        });
      }
    }
  }
};

const runCKBOracle = async () => {
  setInterval(async () => {
    await parseAndStoreOracleData();
    setTimeout(() => {
      getTokenInfo("f79d6afbb6da890132f9d7c355e3015f15f3406f6", tokenInfo => {
        console.log(JSON.stringify(tokenInfo));
      });
    }, 3000);
  }, 1000);
};

runCKBOracle();
