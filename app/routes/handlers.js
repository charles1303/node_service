'use strict';

let errors = require('app/errors');
let httpStatusCodes = require('http-status');

module.exports.setup = function setup(server) {

    server.on('NotFound', (req, res) => {
        res.send(
            httpStatusCodes.NOT_FOUND,
            new errors.MethodNotImplemented('Method not Implemented')
        );
    });

    server.on('VersionNotAllowed', (req, res) => {
        res.send(
            httpStatusCodes.NOT_FOUND,
            new errors.InvalidVersion('Unsupported API version requested')
        );
    });

    server.on('InvalidVersion', (req, res) => {
        res.send(
            httpStatusCodes.NOT_FOUND,
            new errors.InvalidVersion('Unsupported API version requested')
        );
    });

    server.on('uncaughtException', (req, res, route, error) => {
        console.error(error.stack);

        res.send(
            httpStatusCodes.INTERNAL_SERVER_ERROR,
            new errors.InternalServerError('Internal Server Error')
        );
    });

    server.on('MethodNotAllowed', (req, res) => {
        res.send(
            httpStatusCodes.METHOD_NOT_ALLOWED,
            new errors.MethodNotImplemented('Method not Implemented')
        );
    });

};
