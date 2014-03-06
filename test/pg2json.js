var pg2json = require('../'),
    sinon = require('sinon');

require('mocha-as-promised')();

describe('pg2json', function() {
    
    describe('#getTables', function() {
    
        it.skip('should return the tables of the given database', function() {
        });

        it.skip('should fail if the database doesn\'t exist.', function() {
        });
    });

    describe('#getColumns', function() {

        it.skip('should return the columns of a given table', function() {
            pg2json.getColumns('heinzel')
                .should.eventually.become([{
                    name: 'id',
                    type: 'integer'
                }]);
        });

        it.skip('should fail if the table doesn\'t exist.', function() {
        });
    });

    describe('#explain', function() {

        it.skip('should return the format of the output json', function() {
        });

    });
});
