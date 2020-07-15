const router = require("koa-router")();
const list = require("../controller/list");
const history = require("../controller/history");
const detail = require("../controller/detail");

router
  .get("/prices", list)
  .get("/history/:name", history)
  .get("/price/:name", detail);

module.exports = router;
