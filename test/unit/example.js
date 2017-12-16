'use strict';

var expect = require('chai').expect;

describe('Dummy model test', function() {

    it('one equals one', function(done) {
        expect(1).to.equal(1, 'expected one to equal one');
        done();
    });
});
