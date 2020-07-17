const router = require("koa-router")();
const list = require("../controller/list");
const history = require("../controller/history");
const detail = require("../controller/detail");

router
  .get("/prices", list)
  .get("/history/:name", history)
  .get("/prices/:name", detail);

module.exports = router;
