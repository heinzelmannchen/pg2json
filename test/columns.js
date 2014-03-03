var columns = require('../lib/columns'),
    sinon = require('sinon');

require('mocha-as-promised')();

describe('Columns', function() {
    describe('#get', function() {

        it('should return a array of columns for a given table', function() {
            columns.hasTable = sinon.stub().returns(true);
            return columns.get('heinzels').should.eventually.be.like(['name', 'age', 'hat']);
        });


        it('should throw if no table given', function() {
            columns.hasTable = sinon.stub().returns(false);
            return columns.get().should.be.rejected;
        });
    });
});
