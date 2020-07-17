require("dotenv/config");
const CKB = require("@nervosnetwork/ckb-sdk-core").default;
const {Indexer, TransactionCollector} = require("@ckb-lumos/indexer");

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

indexer.tip().then(tip => console.log(parseInt(tip.block_number)));

collectTransactions({
  codeHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
  hashType: "type",
  args: ARGS
});
