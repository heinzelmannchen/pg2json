var conn = require('../lib/connection'),
    relations = require('../lib/relations')({
        Q: require('q'),
        _: require('underscore'),
        Knex: require('knex')
    });

require('mocha-as-promised')();

describe('My-Relations', function() {
    describe('#get', function() {

        it('should list two relations (\'occupation\', \'gender\') for table \'heinzel\'', function() {
            return conn.connect('./integrationTests/db/my-config.json')
                .then(function() {
                    return relations.get('heinzel').should.eventually.have.length(2);
                });
        });

    });
});
