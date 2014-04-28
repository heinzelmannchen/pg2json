var Q = require('q'),
    _ = require('underscore'),
    injections = {
        Q: Q,
        _: _,
        Knex: require('knex')
    },
    dataTypeMappings = {
        integer: 'int'
    },
    columns = require('../lib/columns')(_.extend(injections, {
        dataTypes: {
            map: function (from) {
                var q = Q.defer();
                q.resolve(dataTypeMappings[from]);
                return q.promise;
            }
        }
    })),
    relations = require('../lib/relations')(injections),
    tables = require('../lib/tables')(_.extend(injections, {
            columns: columns,
            relations: relations
        }));

describe('Tables', function() {
    describe('#get', function() {
        it('should return tables with columns', function() {

            columns.get = function () {
                var q = Q.defer();
                q.resolve([{
                    column_name: 'name'
                }, {
                    column_name: 'id'
                }]);
                return q.promise;
            };

            relations.get = function () {
                var q = Q.defer();
                q.resolve([{
                    relation_stuff: 'heinzel'
                }]);
                return q.promise;
            };

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