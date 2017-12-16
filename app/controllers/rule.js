'use strict';

const httpStatus = require('http-status');
const errors     = require('app/errors');
const pick = require('lodash/pick');
class RuleController {

    /**
     * Rule controller constructor
     * @constructor
     * @param {RuleService} service
     * @param logger
     */
    constructor(service, logger) {

        this.logger = logger;
        this.service = service;
    }

    /**
     * Endpoint POST /rules
     * Create a new rule
     * @param req
     * @param res
     * @param next
     */
    create(req, res, next) {
        this.service.createRule(req.body)
        .then(data => res.send(httpStatus.CREATED, data))
        .catch(error => {
            switch (error.constructor) {
                case errors.DuplicateTitle:
                    res.send(httpStatus.BAD_REQUEST, error);
                    break;
                default:
                    res.send(
                        httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error')
                    );
            }
        })
        .then(next);
    }

    /**
     * Endpoint GET /rules/:rule_id
     * @param req
     * @param res
     * @param next
     */
    get(req, res, next) {
        let ruleId = req.params.rule_id;
        this.service.getRule(ruleId)
            .then(data => {
                res.send(httpStatus.OK, data);
            }).catch(err => {
                switch (err.constructor) {
                    case errors.RuleNotFound:
                        res.send(httpStatus.NOT_FOUND, err);
                        break;
                    default:
                        res.send(
                            httpStatus.INTERNAL_SERVER_ERROR,
                            new errors.InternalServerError('Internal Server Error')
                        );
                }
            })
            .then(next);
    }

    /**
     * Endpoint PUT /rules/:rule_id - Update Rule
     *
     * @param req
     * @param res
     * @param next
     */
    update(req, res, next) {
        let data = req.body;
        let ruleId = req.params.rule_id;

        this.logger.debug('Updating rule ' + ruleId);

        this.service.updateRule(ruleId, data)
        .then(ruleData => res.send(httpStatus.OK, ruleData))
        .catch((error) => {
            switch (error.constructor) {
                case errors.RuleNotFound:
                    res.send(httpStatus.NOT_FOUND, error);
                    break;
                default:
                    res.send(
                        httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error')
                    );
            }
        });

        next();
    }

    /**
     * Endpoint GET /rules
     * Retrieve all rules
     * @param req
     * @param res
     * @param next
     */
    getAll(req, res, next) {
        let paginationKeys = ['offset', 'limit'];
        let pagination = pick(req.params, paginationKeys);
        this.service.getRules(pagination)
            .then(rules => {
                res.send(httpStatus.OK, rules);
            }).catch(err => {
                this.logger.error('Unable to fetch rules: ', err.toString());
                res.send(
                    httpStatus.INTERNAL_SERVER_ERROR,
                    new errors.InternalServerError('Internal Server Error')
                );
            });
        next();
    }

}

module.exports = RuleController;
