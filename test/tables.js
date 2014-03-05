var tables = require('../lib/tables'),
    columns = require('../lib/columns'),
    Q = require('q'),
    sinon = require('sinon'),
    mockedKnex;

require('mocha-as-promised')();

describe('Tables', function() {
    describe('#getTables', function() {
        //TODO: multiple tables (array)
        it('should return table with columns', function() {
            tables.getNamesAndSchema = function(){
                var q = Q.defer();
                q.resolve([{table_name: 'heinzel', table_schema: 'public'},
                           /*{table_name: 'occupation', table_schema: 'public'}*/]);
                return q.promise;
            };
            columns.get = function(){
                var q = Q.defer();
                q.resolve([{column_name: 'name'}, {column_name: 'id'}]);
                return q.promise;
            };
            console.log(tables.getTables()[0]);
            return tables.getTables().should.eventually.be.eql(
                {
                    table_name: 'heinzel',
                    table_schema: 'public',
                    columns: [
                        {column_name: 'name'},
                        {column_name: 'id'}
                    ]
                }
            );
        });

    });
});
