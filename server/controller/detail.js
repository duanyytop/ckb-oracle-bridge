const detail = async ctx => {
  const response = {
    name: "BTC/USD",
    price: 240
  };
  ctx.body = response;
};

module.exports = detail;
