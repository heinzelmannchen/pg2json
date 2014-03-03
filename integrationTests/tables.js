var tables = require('../lib/tables'),
    conn = require('../lib/connection'),
    sinon = require('sinon');

require('mocha-as-promised')();

describe('Tables', function() {
    describe('#getTables', function() {

        it('should return a array of tables for a given database', function() {
            return conn.connect('./integrationTests/db/db-config.json')
                .then(function(knex) {
                    return tables.getTables().should.eventually.be.like(['heinzel']);
                });
        });

    });
});
