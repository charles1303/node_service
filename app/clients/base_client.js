'use strict';

let request = require('requestretry');

class BaseClient {

    /**
     * Send a get request
     * @param url Request URL.
     * @param conf Request configuration settings.
     * @returns {Promise.<*>}
     */
    get(url, conf) {

        let config = BaseClient.getConfig(url, 'GET', undefined, conf);
        return Promise.resolve(request(config));
    }

    /**
     * Send a POST request
     * @param url Request URL.
     * @param body Request body.
     * @param conf Request configuration settings.
     * @returns {Promise.<*>}
     */
    post(url, body, conf) {

        let config = BaseClient.getConfig(url, 'POST', body, conf);
        return Promise.resolve(request(config));
    }

    /**
     * Send a DELETE request
     * @param url Request URL.
     * @param conf Request configuration settings.
     * @returns {Promise.<*>}
     */
    delete(url, conf) {

        let config = BaseClient.getConfig(url, 'DELETE', null, conf);
        return Promise.resolve(request(config));
    }

    /**
     * Build the configuration object for a request
     * @param url Request URL.
     * @param body Request body.
     * @param conf Request configuration settings.
     * @param method HTTP method for the request
     * @returns {object}
     */
    static getConfig(url, method, body, conf) {

        return {
            json: true,
            gzip: true,
            timeout: conf.timeout || 1000,
            maxAttempts: conf.retry.count || 3,
            retryDelay: conf.retry.delay || 100,
            retryStrategy: request.RetryStrategies.HTTPOrNetworkError,
            headers: {
                'Content-Type': 'application/json'
            },
            method: method,
            url: url,
            body: body
        };
    }
}

module.exports = BaseClient;
