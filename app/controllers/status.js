'use strict';

const Status     = require('app/lib/status');
const httpStatus = require('http-status');

class StatusController {

    constructor(logger, config, cache, knex) {

        this.logger = logger;
        this.config = config;
        this.cache  = cache;
        this.knex   = knex;
    }

    get(req, res, next) {

        let status = new Status(this.logger, this.config, this.cache, this.knex);

        status.compile()
            .then((response) => {
                this.logger.info('Health check compiled a response - OK');
                res.send(httpStatus.OK, response);
                return next();

            })
            .catch((error) => {
                this.logger.info('Health check failed');
                res.send(httpStatus.INTERNAL_SERVER_ERROR, error);
                return next();
            });
    }
}

module.exports = StatusController;
