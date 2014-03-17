var Q = require('q'),
    proxyquire =  require('proxyquire'),
    sinon = require('sinon'),
    mockedKnex;

require('mocha-as-promised')();

describe('Tables', function() {
    describe('#get', function() {
        it('should return tables with columns', function() {

            var tables = proxyquire('../lib/tables', {
                './columns': {
                    get: function() {
                        var q = Q.defer();
                        q.resolve([{
                            column_name: 'name'
                        }, {
                            column_name: 'id'
                        }]);
                        return q.promise;
                    }
                },
                './relations': {
                    get: function() {
                        var q = Q.defer();
                        q.resolve([{
                            relation_stuff: 'heinzel'
                        }]);
                        return q.promise;
                    }
                }
            });

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

            return tables.get().should.eventually.be.eql(
                [{
                    table_name: 'heinzel',
                    table_schema: 'public',
                    columns: [{
                        column_name: 'name'
                    }, {
                        column_name: 'id'
                    }],
                    relations: [{
                        relation_stuff: 'heinzel'
                    }]
                }, {
                    table_name: 'occupation',
                    table_schema: 'public',
                    columns: [{
                        column_name: 'name'
                    }, {
                        column_name: 'id'
                    }],
                    relations: [{
                        relation_stuff: 'heinzel'
                    }]
                }]);
        });

    });
});