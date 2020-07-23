const Koa = require("koa");
const {fork} = require("child_process");
const worker = fork(__dirname + "/src/indexer/worker.js");
const router = require("./src/router");

worker.send({start: true});

const koa = new Koa();

koa.use(router.routes());

koa.listen(40000);
