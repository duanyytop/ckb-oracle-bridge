require("dotenv/config");
const CKB = require("@nervosnetwork/ckb-sdk-core").default;

const CKB_URL = process.env.CKB_URL || "http://127.0.0.1:8114";
const ckb = new CKB(CKB_URL);

const PRI_KEY = process.env.PRI_KEY || "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"; // private key for demo, don't expose it in production
const PUB_KEY = ckb.utils.privateKeyToPublicKey(PRI_KEY);
const ARGS = "0x" + ckb.utils.blake160(PUB_KEY, "hex");
const ADDRESS = ckb.utils.pubkeyToAddress(PUB_KEY);

module.exports = {ckb, PRI_KEY, ARGS, ADDRESS};
