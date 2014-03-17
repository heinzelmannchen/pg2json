var sinon = require('sinon'),
    proxyquire =  require('proxyquire'),
    Q = require('q');

require('mocha-as-promised')();

describe('Relations', function() {
    describe('#get', function() {

        it('should load the corresponding table if it\'s a relation', function() {
            var relations = proxyquire('../lib/relations', {
                './tables': {
                    get: function() {
                        var q = Q.defer();
                        q.resolve({
                            'tablestuff': '1'
                        });
                        return q.promise;
                    }
                }
            });
            
            relations.getMetadata = function() {
                var q = Q.defer();
                q.resolve({rows: [{
                    'referenced_table_name': 'occupation'
                }]});
                return q.promise;
            };
            
            return relations.get('a table').should.eventually.be.like([{
                referenced_table_name: 'occupation',
                table: {
                    'tablestuff': '1'
                }
            }]);
        });
    });
});
