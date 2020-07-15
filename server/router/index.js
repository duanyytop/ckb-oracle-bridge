const router = require("koa-router")();
const detail = require("../controller/detail");

router.get("/detail", detail).get("/", async ctx => {
  ctx.body = {
    title: "CKB Oracle Bridge",
    description: "CKB Oracle Bridge"
  };
});

module.exports = router;
