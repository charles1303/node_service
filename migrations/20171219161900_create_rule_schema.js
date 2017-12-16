'use strict';

let constants = require('app/config/constants');

exports.up = function(knex) {
    return knex.schema
        .createTableIfNotExists('rules', function(table) {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.text('conditions').notNullable();
            table.string('action').nullable();
            table.enu('status', [constants.statuses.active, constants.statuses.inactive]);
            table.string('updated_by').notNullable();
            table.timestamps();
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('rules');
};
