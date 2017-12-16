'use strict';

let config     = require('app/config/config');
let routes     = require('app/routes/routes');
let handlers   = require('app/routes/handlers');
var log = require('logger').createLogger();

let joi        = require('joi');

let restify    = require('restify');

let yamljs = require('yamljs');
let docs = yamljs.load('swagger.yaml');


let serviceLocator = require('app/config/di');

let server = restify.createServer({
    name: config.appName,
    versions: ['1.0.0']
});

server.pre(restify.pre.sanitizePath());

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());



handlers.setup(server, serviceLocator);
routes.setup(server, serviceLocator, docs);

server.listen(config.webserver.port, function() {
    log.info('%s listening at %s', server.name, server.url);

});

server.use(function(req,res,next){
    res.setHeader('content-type','application/json')
    next()
  });

module.exports = server;
