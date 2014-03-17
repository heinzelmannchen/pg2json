var tables = require('../lib/tables'),
    columns = require('../lib/columns'),
    Q = require('q'),
    sinon = require('sinon'),
    mockedKnex;

require('mocha-as-promised')();

describe('Tables', function() {
    describe('#get', function() {
        it('should return tables with columns', function() {
            tables.getMetadata = function() {
                var q = Q.defer();
                q.resolve([{
                    table_name: 'heinzel',
                    table_schema: 'public'
                }, {
                    table_name: 'occupation',
                    table_schema: 'public'
                }]);
                return q.promise;
            };
            columns.get = function() {
                var q = Q.defer();
                q.resolve([{
                    column_name: 'name'
                }, {
                    column_name: 'id'
                }]);
                return q.promise;
            };
            return tables.get().should.eventually.be.eql(
                [{
                    table_name: 'heinzel',
                    table_schema: 'public',
                    columns: [{
                        column_name: 'name'
                    }, {
                        column_name: 'id'
                    }]
                }, {
                    table_name: 'occupation',
                    table_schema: 'public',
                    columns: [{
                        column_name: 'name'
                    }, {
                        column_name: 'id'
                    }]
                }]);
        });

    });
});