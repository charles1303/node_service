'use strict';

const bookshelf = require('app/bookshelf');
const errors = require('app/errors');
const constants = require('app/config/constants');

let Rule = bookshelf.Model.extend({
    tableName: 'rules',
    hasTimestamps: true,
    
    save: function() {
        return bookshelf.Model.prototype.save.apply(this, arguments)
        .catch((error) => {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new errors.DuplicateName('Rule with the same name already exists');
            }

            throw errors.InternalServerError('Error creating rule');
        });
    },

    fetch: function() {
        return bookshelf.Model.prototype.fetch.apply(this, arguments)
        .catch(error => {
            if (error instanceof Rule.NotFoundError) {
                throw new errors.RuleNotFound('Rule not found');
            }

            throw error;
        });
    },

    destroy: function() {
        return bookshelf.Model.prototype.destroy.apply(this, arguments)
        .catch(error => {
            if (error instanceof Rule.NoRowsDeletedError) {
                throw new errors.RuleNotFound('Rule not found');
            }

            throw error;
        });
    },

});

module.exports = bookshelf.model('Rule', Rule);
