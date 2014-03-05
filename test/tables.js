var tables = require('../lib/tables'),
    sinon = require('sinon'),
    mockedKnex;

require('mocha-as-promised')();

describe.skip('Tables', function() {
    describe('#getTables', function() {
        beforeEach(function() {
            /*mockedKnex = {
                initialize: sinon.stub().returns(function() {})
            };
            conn.setKnex(mockedKnex);*/
        });

        it('should return all table names', function() {
            return tables.getTables().should.eventually.be.eql([{table_name: 'heinzel', table_schema: 'public'}]);
        });
    });
});
