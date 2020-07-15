const price = require("../mocks/price");

const detail = async ctx => {
  ctx.body = price;
};

module.exports = detail;
