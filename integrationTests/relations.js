var relations = require('../lib/relations'),
    conn = require('../lib/connection'),
    sinon = require('sinon');

require('mocha-as-promised')();

describe('Relations', function() {
    describe('#get', function() {

        it('should list two relations (\'occupation\', \'gender\') for table \'heinzel\'', function() {
            return conn.connect('./integrationTests/db/db-config.json')
                .then(function(knex) {
                    return relations.get('heinzel').should.eventually.have.length(2);
                });
        });

    });
});
