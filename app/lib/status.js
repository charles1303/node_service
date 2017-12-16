'use strict';

const packjson = require('../../package.json');

const SERVICE_TIMEBOX_MS = 3000;

/**
 * @class Status
 */
class Status {

    constructor(logger, config, cache, knex) {
        this.logger = logger;
        this.config = config;
        this.cache  = cache;
        this.knex   = knex;

        this.logger.debug('Constructing a Status object');

        this.application = {
            name: '',
            platform: '',
            uptime_min: '',
            node_version: '',
            dep_versions: {},
            app_version: '',
            memory_usage: {},
            connection_status: {},
            timing_ms: {}
        };

        this.getGeneralInfo();
    }

    getGeneralInfo() {
        this.logger.info('Getting general application data');
        this.application.node_version = process.version;
        this.application.dep_versions = packjson.dependencies;
        this.application.name = this.config.appName;
        this.application.platform = process.platform;
        this.application.memory_usage = process.memoryUsage();
        this.application.uptime_min = process.uptime() / 60;
        this.application.app_version = packjson.version;
    }

    compile() {
        return new Promise((superResolve, superReject) => {

            let promiseRedis = new Promise((resolve) => {

                this.readRedis((redisState, redisTime) => {
                    if (redisState) {
                        this.logger.info('Status on Redis: OK');
                    } else {
                        this.logger.info('Status on Redis: DOWN');
                    }

                    this.application.connection_status.redis = redisState;
                    this.application.timing_ms.redis = redisTime;
                    resolve(redisState);
                });
            });

            let promiseMysql = this.readMysql()
                .then((mysqlState) => {
                    if (!mysqlState) {
                        throw new Error('MySQL is down');
                    }

                    this.logger.info('Status on MySQL: OK');
                    this.application.connection_status.mysql = true;
                    return (mysqlState);
                }).catch((mysqlError) => {
                    this.logger.info('Status on MySQL: DOWN (%s)', mysqlError);
                    this.application.connection_status.mysql = false;
                    return (false);
                });

            // Resolve all the promises
            Promise.all([promiseRedis, promiseMysql])
                .then((values) => {
                    this.logger.info('Status & Health - All promises completed.');

                    for (let i = 0, len = values.length; i < len; i++) {
                        if (values[i] === false) {
                            throw new Error('Offline service detected.');
                        }
                    }

                    superResolve(this.application);
                })
                .catch((errorAll) => {
                    this.logger.error('Status & Health Error: ' + errorAll);
                    superReject(this.application, errorAll);
                });
        });
    }

    readRedis(next) {
        this.logger.info('Starting readRedis() check');
        var hrstart = process.hrtime();
        let key = 'health:' + hrstart;
        let value = 'temporary_status_check';
        try {
            this.cache.set(key, value, 5);

            let stasis = setTimeout(() => {
                this.logger.info('Starting readRedis() stasis. Respond or else.');
                next(false, null); // no one is home, let's go.
            }, SERVICE_TIMEBOX_MS);

            this.cache.get(key, (result) => {

                if (result === value) {
                    var hrend = process.hrtime(hrstart);
                    next(true, hrend[1] / 1000000);
                } else {
                    next(false, null);
                }

                clearTimeout(stasis);
            });

        } catch (error) {
            this.logger.error('Error within readRedis: ' + error.message);
            next(false, null);
        }
    }

    readMysql() {
        this.logger.info('Starting readMysql() check');
        var hrstart = process.hrtime();
        return this.knex.raw('SELECT 1+1')
            .then(() => {
                var hrend = process.hrtime(hrstart);
                this.application.timing_ms.mysql = hrend[1] / 1000000;
                this.application.connection_status.mysql = true;
                return true;
            }).catch((error) => {
                this.logger.error('Error within readMysql: ' + error.message);
                return false;
            });
    }

}

module.exports = Status;
