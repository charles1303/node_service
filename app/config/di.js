'use strict';

let config = require('app/config/config');
let serviceLocator = require('node-service-locator');

let Cache = require('redis');

let RuleService = require('app/services/rule');

let StatusController = require('app/controllers/status');
let RuleController = require('app/controllers/rule');

serviceLocator.register('logger', () => {
    return require('logger').create(config.logging);
});


serviceLocator.register('cache', () => {
    let cache = new Cache(config.redis.port, config.redis.host);
    cache.select(config.redis.database);

    return cache;
});

serviceLocator.register('knex', () => {
    return require('knex')({
        client: 'mysql',
        connection: config.mysql.connection,
        pool: config.mysql.pool
    });
});


serviceLocator.register('ruleService', (serviceLocator) => {

    let logger = serviceLocator.get('logger');
    let cache = serviceLocator.get('cache');

    return new RuleService(logger, metrics, cache);
});

serviceLocator.register('statusController', (serviceLocator) => {

    let logger = serviceLocator.get('logger');
    let cache  = serviceLocator.get('cache');
    let knex   = serviceLocator.get('knex');

    return new StatusController(logger, config, cache, knex);
});


serviceLocator.register('ruleController', (serviceLocator) => {

    let logger = serviceLocator.get('logger');
    let ruleService = serviceLocator.get('ruleService');

    return new RuleController(ruleService, logger);
});

module.exports = serviceLocator;
