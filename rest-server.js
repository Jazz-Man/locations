var db = require('./db');
var jsonServer = require('json-server');
var server = jsonServer.create();
var middlewares = jsonServer.defaults();
var router = jsonServer.router(db);

server.use(middlewares);
server.use(router);
server.listen(3000, function () {
  console.log('JSON Server is running')
});