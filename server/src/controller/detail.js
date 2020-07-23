const {getTokenInfo} = require("../database");

const getDetail = async (contract, timestamp) => {
  const tokenInfo = await getTokenInfo(contract, timestamp);
  return tokenInfo ? tokenInfo : {};
};

const detail = async ctx => {
  const contract = ctx.path.substring(ctx.path.lastIndexOf("/") + 1);
  const {timestamp} = ctx.query;
  ctx.body = await getDetail(contract, timestamp);
};

module.exports = detail;
