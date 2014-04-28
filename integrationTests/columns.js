var conn = require('../lib/connection'),
    sinon = require('sinon'),
    Q = require('q'),
    dataTypeMappings = {
        integer: 'int'
    },
    columns = require('../lib/columns')({
        Q: Q,
        _: require('underscore'),
        Knex: require('knex'),
        dataTypes: {
            map: function (from) {
                var q = Q.defer();
                q.resolve(dataTypeMappings[from]);
                return q.promise;
            }
        }
    });

require('mocha-as-promised')();

describe('Columns', function() {
    describe('#get', function() {

        it('should return a array of columns for a given table', function() {
            return conn.connect('./integrationTests/db/db-config.json')
                .then(function(knex) {
                    return columns.get('heinzel').then(function(cols) {
                        return cols;
                    }).should.eventually.to.have.length(6);
                });
        });

    });
});
