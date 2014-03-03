var Q = require('q'),
    Knex = require('knex'),
    me = module.exports;

me.getTables = function() {
    var q = Q.defer();

    var fu = Knex.knex('information_schema.tables').select();

    q.resolve([{
        table_name: 'heinzel'
    }, {
        table_name: 'occupation'
    }]);

    return q.promise;
};
