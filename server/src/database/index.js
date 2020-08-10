const levelup = require("levelup");
const leveldown = require("leveldown");

let db = null;

const createDB = () => {
  return levelup(leveldown("./token-info-db"));
};

const putTokenInfo = async tokenInfo => {
  if (!db) {
    db = createDB();
  }
  const {contract, timestamp} = tokenInfo;
  try {
    try {
      await db.get(`${contract}:${timestamp}`);
    } catch (error) {
      if (error) {
        await db.put(`${contract}:${timestamp}`, JSON.stringify(tokenInfo));
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const getTokenInfo = async (contract, timestamp) => {
  if (!db) {
    db = createDB();
  }
  try {
    return (await db.get(`${contract}:${timestamp}`)).toString("utf8");
  } catch (error) {
    console.error(error);
  }
};

const getTokenInfoList = contract => {
  let tokenInfoList = [];
  return new Promise((resolve, reject) => {
    if (!db) {
      db = createDB();
    }
    db.createReadStream({
      gte: `${contract}:`,
      lte: `${contract}:~`,
      reverse: true
    })
      .on("data", data => {
        tokenInfoList.push(JSON.parse(data.value.toString("utf8")));
      })
      .on("error", error => {
        reject(error);
      })
      .on("end", () => {
        resolve(tokenInfoList);
      });
  });
};

module.exports = {putTokenInfo, getTokenInfo, getTokenInfoList};
