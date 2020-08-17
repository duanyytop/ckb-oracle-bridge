# CKB Oracle Bridge

CKB Oracle Bridge is an oracle bridge fetching crypto tokens' prices from [Coinbase Oracle](https://docs.pro.coinbase.com/#oracle) for Nervos CKB.

CKB Oracle Bridge includes two parts: server and client.

### Server

Server is a web server to fetch Coinbase Oracle data from Nervos CKB, decode and store oracle data, and provide http api to Client.

### Client

Client is a web application that renders oracle data which comes from Server.

### Prerequisites

- CKB Node ([CKB websocket](https://github.com/nervosnetwork/ckb/wiki/RPC-subscription) is needed)
- Node.js 12+

### Getting Started

```shell
$ git clone https://github.com/duanyytop/ckb-oracle-bridge
$ cd ckb-oracle-bridge
$ yarn bootstrap
$ yarn start:server
$ yarn start:client
```

> Note: Server need a while to indexer ckb oracle data and put it to database, so Client should wait a moment to start after starting Server.
