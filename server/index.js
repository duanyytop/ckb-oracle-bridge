const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const router = require("./router");

const koa = new Koa();

koa.use(BodyParser());

koa.use(router.routes());

koa.listen(40000);
