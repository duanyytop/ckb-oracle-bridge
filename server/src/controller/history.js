const priceHistory = require("../mocks/price_history");

const history = async ctx => {
  ctx.body = priceHistory;
};

module.exports = history;
