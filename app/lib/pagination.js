'use strict';

let constants = require('app/config/constants');

module.exports = {
    getPagination: (params) => {
        let pagination = {};
        pagination.limit = parseInt(params.limit) || constants.pagination.LIMIT;
        pagination.offset = parseInt(params.offset) || constants.pagination.OFFSET;
        pagination.limit = Math.min(pagination.limit, constants.pagination.MAX_LIMIT);

        return pagination;
    }
};
