var columns = require('../lib/columns'),
    Q = require('q'),
    sinon = require('sinon'),
    injections = {
        Q: Q,
        _: require('underscore'),
        Knex : require('knex')
    };

require('mocha-as-promised')();

describe('Columns', function() {
    describe('#get', function() {

        it('should return a array of columns for a given table', function() {
            columns.hasTable = sinon.stub().returns(true);
            columns.getColumns = function() {
                var q = Q.defer();
                q.resolve([{
                    column_name: 'id',
                    data_type: 'integer'
                }]);
                return q.promise;
            };
            return columns(injections).get('heinzels').should.eventually.be.like([{
                column_name: 'id',
                data_type: 'int'
            }]);
        });


        it('should throw if no table given', function() {
            columns.hasTable = sinon.stub().returns(false);
            return columns(injections).get().should.be.rejected;
        });
    });
});
