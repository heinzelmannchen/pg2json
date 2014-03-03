var conn = require('../lib/connection'),
    mockFs = require('mock-fs');
require('mocha-as-promised')();

describe('Connection', function() {
    describe('#connect', function() {
        beforeEach(function() {
            mockFs({
                'db-config.json': '{}'
            });
        });

        afterEach(function() {
            mockFs.restore();
        });

        it('should return a connection object', function() {
            return conn.connect().should.be.a('object')
                .and.has.property('select');
        });

        it('should read the given json', function() {
            return conn.connect('db-config.json').should.be.a('object');
        });

        it('should fail if the config does not exist', function() {
            return conn.connect('missing.json').should.be.rejected;
        });

        it('should create a connection from a config object', function() {
            return conn.connect({}).should.be.a('object');
        });
    });
});
