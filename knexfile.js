var config = require('app/config/config');

var dbConfig = {
    client: 'mysql',
    connection: config.mysql.connection || 'mysql',
    pool: config.mysql.pool,
    migrations: {
        tableName: 'migrations'
    },
    seeds: {
        directory: './seeds/'
    }
};

module.exports = {
    development: dbConfig
};
