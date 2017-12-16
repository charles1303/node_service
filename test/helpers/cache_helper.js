'use strict';

let mockery = require('mockery');

let cacheMock = function() {
    return {
        select: function() {},

        set: function() {},

        get: function(key, callback) {
            callback(false, false);
        },

        del: function() {}
    };
};

module.exports = {
    mock: function() {

        mockery.enable({
            warnOnReplace: true,
            warnOnUnregistered: false
        });

        mockery.registerMock('redis', cacheMock);
    }
};
