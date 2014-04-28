var conn = require('../lib/connection'),
    Q = require('q'),
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
