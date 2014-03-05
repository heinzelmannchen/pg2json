var tables = require('../lib/tables'),
    conn = require('../lib/connection'),
    sinon = require('sinon');

require('mocha-as-promised')();

describe('Tables', function() {
    describe('#getTables', function() {

        it.skip('should return a array of tables for a given database', function() {
            return conn.connect('./integrationTests/db/db-config.json')
                .then(function(knex) {
                    return tables.getTables().should.eventually.be.eql([
                        {
                            table_name: 'heinzel',
                            table_schema: 'public'
                        },
                        {
                            table_name: 'occupation',
                            table_schema: 'public'
                        }
                    ]);
                });
        });

    });
});
