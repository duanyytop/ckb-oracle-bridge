const prices = require("../mocks/prices");

const list = async ctx => {
  ctx.body = prices;
};

module.exports = list;
