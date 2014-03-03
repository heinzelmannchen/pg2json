var conn = require('../lib/connection'),
    Knex = require('knex');
require('mocha-as-promised')();

describe('Connection', function() {
    describe('#connect', function() {

        it('should read the given json', function() {
            return conn.connect('./test/mock/db-config.json').should.eventually.be.a('function');
        });

        it('should fail if the config does not exist', function() {
            return conn.connect('missing.json').should.be.rejected;
        });

        it('should create a connection from a config object', function() {
            return conn.connect({}).should.be.a('object');
        });

        it.skip('should fail if the connection could not be established', function() {
        });
    });
});
