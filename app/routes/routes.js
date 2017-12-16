'use strict';

let config  = require('app/config/config');

module.exports.setup = function setup(server, serviceLocator, docs) {

    let rule = serviceLocator.get('ruleController');

    server.post({
        path: '/rules',
        name: 'create_rule',
        version: '1.0.0',
        accept: 'application/json',
    }, (req, res, next) => rule.create(req, res, next));
    
    server.get({
        path: '/rules/:rule_id',
        name: 'get_rule',
        version: '1.0.0'
    }, (req, res, next) => rule.get(req, res, next));

    server.get({
        path: '/api-docs',
        name: 'swagger_docs_v1',
        version: '1.0.0'
    },  (req, res, next) => {
        res.contentType = 'text/plain';
        res.send(docs);
        next();
    });
    

};
