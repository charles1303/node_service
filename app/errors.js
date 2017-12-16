
'use strict';

var create = require('custom-error-generator');

module.exports = {
    InvalidVersion: create('InvalidVersion', { code: 'INVALID_VERSION' }),

    MethodNotImplemented: create('MethodNotImplemented', { code: 'METHOD_NOT_IMPLEMENTED' }),

    InvalidParams: create('InvalidParamsError', { code: 'INVALID_PARAMS' }),

    InternalServerError: create('InternalServerError', { code: 'INTERNAL_SERVER_ERROR' }),

    DuplicateName: create('DuplicateName', { code: 'DUPLICATE_NAME' }),
    
    RuleNotFound: create('RuleNotFound', { code: 'RULE_NOT_FOUND' }),
};
