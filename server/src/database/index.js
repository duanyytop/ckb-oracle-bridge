const levelup = require("levelup");
const leveldown = require("leveldown");

let db = null;

const setTokenInfo = async tokenInfo => {
  if (!db) {
    db = levelup(leveldown("./token-info-db"));
  }
  const {contract, timestamp} = tokenInfo;
  try {
    await db.put(`${contract}:${timestamp}`, JSON.stringify(tokenInfo));
  } catch (error) {
    console.error(error);
  }
};

const getTokenInfo = async (contract, callback) => {
  if (!db) {
    db = levelup(leveldown("./token-info-db"));
  }
  db.createReadStream({
    gte: `${contract}:`,
    lte: String.fromCharCode(contract.charCodeAt(0) + 1)
  })
    .on("data", function(data) {
      callback(data.value.toString("utf8"));
    })
    .on("error", function(error) {
      console.error("DB error", error);
    })
    .on("close", function() {
      console.info("DB stream closed");
    })
    .on("end", function() {
      console.info("DB stream ended");
    });
};

module.exports = {setTokenInfo, getTokenInfo};
