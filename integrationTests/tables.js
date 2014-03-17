var tables = require('../lib/tables'),
    conn = require('../lib/connection'),
    sinon = require('sinon');

require('mocha-as-promised')();

describe('Tables', function() {
    describe('#get', function() {

        it('should return an array of tables for a given database', function() {
            return conn.connect('./integrationTests/db/db-config.json')
                .then(function(knex) {
                    return tables.get().should.eventually.have.length(3);
                });
        });

        it('should return a table for a given database', function() {
            return conn.connect('./integrationTests/db/db-config.json')
                .then(function(knex) {
                    return tables.get('heinzel').should.eventually.have.length(1);
                });
        });
    });
});
