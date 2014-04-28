var conn = require('../lib/connection'),
    sinon = require('sinon'),
    mockedKnex;

describe('Connection', function() {
    describe('#connect', function() {
        beforeEach(function() {
            mockedKnex = {
                initialize: sinon.stub().returns(function() {})
            };
            conn.setKnex(mockedKnex);
        });

        it('should read the given json and create a connection', function() {
            return conn.connect('./test/mock/db-config.json')
                .then(function() {
                    mockedKnex.initialize.should.have.been.calledWithMatch({
                        client: 'pg',
                        connection: {
                            charset: 'utf8',
                            database: 'test',
                            host: '127.0.0.1',
                            password: '',
                            user: 'stoeffel'
                        }
                    });
                });
        });

        it('should fail if the config does not exist', function() {
            return conn.connect('missing.json').should.be.rejected;
        });

        it('should create a connection from a config object', function() {
            return conn.connect({
                heinzel: 'anton'
            }).then(function() {
                mockedKnex.initialize.should.have.been.calledWithMatch({
                    client: 'pg',
                    connection: {
                        heinzel: 'anton'
                    }
                });
            });
        });

        before(function() {
            mockedKnex = {
                initialize: sinon.stub().throws()
            };
            conn.setKnex(mockedKnex);
        });
        it('should fail if the connection could not be established', function() {
            return conn.connect({
                heinzel: 'anton'
            }).fail(function() {
                mockedKnex.initialize.should.have.thrown();
            });
        });
    });
});
