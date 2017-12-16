'use strict';

let Rule = require('app/models/rule');
const shortid    = require('shortid');
const pagination = require('app/lib/pagination');
const pick = require('lodash.pick');

class RuleService {

    /**
     * Rule service constructor
     *
     * @constructor
     * @param {logger} logger instance of logger
     * @param {cache} cache instance of the cache library.
     */
    constructor(logger, metrics, cache) {
        this.logger = logger;
        this.cache = cache;
    }

    /**
     * Create a new rule
     *
     * @returns {Promise}
     */
    createRule(data) {
        let reqId = shortid.generate();
        let name = data.name;
        
        this.logger.info(`Request ID: ${reqId} - Creating new rule ${name}`);

        return new Rule().save(data, { method: 'insert' })
        .then(rule => {
            this.logger.info(`Request ID: ${reqId} - Successfully created rule with name ${name}`);
            
            return rule.refresh();
        })
        .catch(err => {
            this.logger.error(`Request ID: ${reqId} - Failed to create a rule caused by error: ${err.stack}`);

            throw err;
        });

    }

    /**
     * Gets a rule
     * Accepts the rule id as Parameter
     * @param ruleId
     * @returns {Promise.<T>|*}
     */
    getRule(ruleId) {
        let reqId = shortid.generate();

        this.logger.info(`Request ID: ${reqId} - getting rule based on the id ${ruleId}`);

        return new Rule({ id: ruleId }).fetch({ require: true })
            .then(rule => {
                let loginfo = `Request ID: ${reqId} - Successfully retrieved rule based on the id ${ruleId}`;
                this.logger.info(loginfo);
                return rule;
            }).catch(err => {
                this.logger.error(`Request ID: ${reqId} - Failed to fetch rule: ${err.stack}`);
                throw err;
            });
    }

    /**
     * Update an existing rule
     *
     * @param ruleId
     * @param data
     * @returns {Promise}
     */
    updateRule(ruleId, data) {
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Updating rule with id ${ruleId} `);

        
        return new Rule({ id: ruleId }).fetch({ require: true })
        .then(rule => {
            return rule.save(data, { patch: true });
        })
        .then(rule => {
            this.logger.info(`Request ID: ${reqId} - Successfully updated rule: ${ruleId}`);

            return rule;
        })
        .catch(err => {
            this.logger.info(`Request ID: ${reqId} - Failed to update rule ${ruleId}: ${err.toString()}`);

            throw err;
        });
    }

    /**
     * Get all rules
     * @paginationParams
     * @returns {Promise}
     */
    getRules(paginationParams) {
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Retrieve all rules`);
        let pages = pagination.getPagination(paginationParams);
        let queryBuilder = Rule.query();
        return queryBuilder.count()
            .then(count => {
                pages.total = count;
                return Rule.query(qb => {
                    qb.limit(pages.limit).offset(pages.offset);
                }).fetchAll();

            }).then(rules => {
                this.logger.info(`Request ID: ${reqId} - Retrieved all rules`);
                pages.rules = rules;
                return pages;
            }).catch(error => {
                switch (error.constructor) {
                    default:
                        
                }
                this.logger.error(`Request ID: ${reqId} - Error retrieving rules: ${error.message}`);
                throw error;
            });
    }

}

module.exports = RuleService;
