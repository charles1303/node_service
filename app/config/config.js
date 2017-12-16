'use strict';

var appName = 'nodeService';
var config = {
    environment: process.env.NODE_ENV,
    appName: appName,
    dev_mode: process.env.DEV_MODE,
    webserver: {
        port: process.env.PORT || '8080'
    },
    logging: {
        file: process.env.LOG_PATH || '/tmp/nodeservice.log',
        level: process.env.LOG_LEVEL || 'info',
        console: process.env.LOG_ENABLE_CONSOLE || true
    },
    mysql: {
        connection: {
            host: process.env.MYSQL_PORT_3306_TCP_ADDR || process.env.DATABASE_HOST || "localhost",
            port: process.env.MYSQL_PORT_3306_TCP_PORT || process.env.DATABASE_PORT || "3306",
            database: process.env.DATABASE_NAME || "nodeservice",
            user: process.env.DATABASE_USERNAME || "nodeservice",
            password: process.env.DATABASE_PASSWORD || "nodeservice",
            debug: process.env.DATABASE_DEBUG ? ['ComQueryPacket'] : false
        },
        pool: {
            min: (process.env.DATABASE_POOL_MIN) ? parseInt(process.env.DATABASE_POOL_MIN) : 2,
            max: (process.env.DATABASE_POOL_MAX) ? parseInt(process.env.DATABASE_POOL_MAX) : 2
        }
    },
    redis: {
        host: process.env.REDIS_PORT_6379_TCP_ADDR || process.env.REDIS_HOST,
        port: process.env.REDIS_PORT_6379_TCP_PORT || process.env.REDIS_PORT || 6379,
        database: process.env.REDIS_DATABASE || 0,
        batch_ttl: process.env.ITEM_TTL || 300,
        list_ttl: process.env.LIST_TTL || 30
    }
    
};

module.exports = config;
