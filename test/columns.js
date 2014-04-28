var Q = require('q'),
    _ = require('underscore'),
    sinon = require('sinon'),
    dataTypeMappings = {
        integer: 'int'
    },
    injections = {
        Q: Q,
        _: _,
        Knex: require('knex')
    },
    columns = {};

describe('Columns', function() {
    describe('#get', function () {

        it('should return a array of columns', function () {
            columns = require('../lib/columns')(injections);
            columns.hasTable = sinon.stub().returns(true);
            columns.getColumns = function () {
                var q = Q.defer();
                q.resolve([{
                    column_name: 'id',
                    data_type: 'integer'
                }]);
                return q.promise;
            };
            return columns.get('heinzels').should.eventually.be.like([{
                column_name: 'id',
                data_type: 'integer'
            }]);
        });

        it('should return an array of columns and map datatypes', function () {
            columns = require('../lib/columns')(_.extend(injections, {
                dataTypes: {
                    map: function (from) {
                        var q = Q.defer();
                        q.resolve(dataTypeMappings[from]);
                        return q.promise;
                    }
                }
            }));

            columns.hasTable = sinon.stub().returns(true);
            columns.getColumns = function () {
                var q = Q.defer();
                q.resolve([{
                    column_name: 'id',
                    data_type: 'integer'
                }]);
                return q.promise;
            };
            return columns.get('heinzels').should.eventually.be.like([{
                column_name: 'id',
                data_type: 'int'
            }]);
        });

        it('should throw if no table given', function() {
            columns = require('../lib/columns')(injections);
            columns.hasTable = sinon.stub().returns(false);
            return columns.get().should.be.rejected;
        });
    });
});
